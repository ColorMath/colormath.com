/**
 * Tests for the contact-form Worker, with Resend mocked at `fetch`.
 * Run with `npm test` (Node strips the types itself).
 */
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import worker, { parseSubmission, type Env } from "./index.ts";

const ORIGIN = "https://colormath.com";
const env: Env = {
  RESEND_API_KEY: "re_test",
  TO: "jessica@jessicatenuta.com, hello@craigmbooth.com",
  FROM: "Color/Math website <hello@colormath.com>",
  ALLOWED_ORIGINS: `${ORIGIN}, http://localhost:3000`,
};
const valid = { name: "Jane Doe", email: "jane@acme.com", company: "Acme", message: "Hello" };

let sent: { headers: Record<string, string>; body: Record<string, unknown> }[];
let status: number;
beforeEach(() => {
  sent = [];
  status = 200;
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    sent.push({ headers: init.headers as Record<string, string>, body: JSON.parse(init.body as string) });
    return new Response(status === 200 ? '{"id":"x"}' : "nope", { status });
  }) as typeof fetch;
});

const post = (body: object, origin = ORIGIN) =>
  worker.fetch(
    new Request("https://worker.test/", {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    env,
  );

test("valid submission emails both founders with reply-to the visitor", async () => {
  const res = await post(valid);
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), ORIGIN);
  assert.equal(sent.length, 1);
  const { headers, body } = sent[0];
  assert.equal(headers.Authorization, "Bearer re_test");
  assert.deepEqual(body.to, ["jessica@jessicatenuta.com", "hello@craigmbooth.com"]);
  assert.equal(body.reply_to, "jane@acme.com");
  assert.equal(body.from, env.FROM);
  assert.equal(body.subject, "Website inquiry from Jane Doe (Acme)");
  assert.match(String(body.text), /Hello/);
});

test("unknown origins are refused before anything is sent", async () => {
  const res = await post(valid, "https://evil.example");
  assert.equal(res.status, 403);
  assert.equal(sent.length, 0);
});

test("preflight is answered for allowed origins", async () => {
  const res = await worker.fetch(
    new Request("https://worker.test/", { method: "OPTIONS", headers: { Origin: ORIGIN } }),
    env,
  );
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("Access-Control-Allow-Methods"), "POST");
});

test("honeypot submissions get a 204 and send nothing", async () => {
  const res = await post({ ...valid, website: "http://spam.example" });
  assert.equal(res.status, 204);
  assert.equal(sent.length, 0);
});

test("missing or malformed fields are rejected", async () => {
  for (const bad of [{ ...valid, name: " " }, { ...valid, email: "nope" }, { ...valid, message: "" }]) {
    const res = await post(bad);
    assert.equal(res.status, 400);
  }
  assert.equal(sent.length, 0);
});

test("company is optional and fields are trimmed and capped", () => {
  const sub = parseSubmission({ name: "  Jane ", email: "jane@acme.com", message: "x".repeat(6000) });
  assert.equal(sub?.name, "Jane");
  assert.equal(sub?.company, "");
  assert.equal(sub?.message.length, 5000);
});

test("a Resend failure surfaces as 502 so the page can fall back to email", async () => {
  status = 500;
  const res = await post(valid);
  assert.equal(res.status, 502);
});
