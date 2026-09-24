/**
 * Contact-form Worker: validates a /contact submission and emails it to the
 * founders through Resend. The site is static (GitHub Pages), so this is its
 * only server-side code; it keeps the Resend key and the recipient addresses
 * out of the browser.
 */

export interface Env {
  RESEND_API_KEY: string;
  /** Comma-separated recipients. */
  TO: string;
  /** "Name <address>" on a Resend-verified domain. */
  FROM: string;
  /** Comma-separated origins allowed to post. */
  ALLOWED_ORIGINS: string;
}

export interface Submission {
  name: string;
  email: string;
  company: string;
  message: string;
}

const RESEND = "https://api.resend.com/emails";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const origin = req.headers.get("Origin") ?? "";
    const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
    if (!allowed.includes(origin)) return new Response(null, { status: 403 });

    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
    const reply = (status: number, body?: object) =>
      body
        ? Response.json(body, { status, headers: cors })
        : new Response(null, { status, headers: cors });

    if (req.method === "OPTIONS") return reply(204);
    if (req.method !== "POST") return reply(405);

    let raw: Record<string, unknown>;
    try {
      raw = await req.json();
    } catch {
      return reply(400, { error: "invalid" });
    }
    // Honeypot: a field people never see. Bots that fill it are dropped quietly.
    if (String(raw.website ?? "").trim()) return reply(204);

    const sub = parseSubmission(raw);
    if (!sub) return reply(400, { error: "invalid" });

    const res = await fetch(RESEND, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email(sub, env)),
    });
    if (!res.ok) {
      console.error("resend", res.status, await res.text());
      return reply(502, { error: "send" });
    }
    return reply(204);
  },
};

/** Trimmed, length-capped fields, or null when a required one is missing or malformed. */
export function parseSubmission(raw: Record<string, unknown>): Submission | null {
  const field = (key: string, max: number) => String(raw[key] ?? "").trim().slice(0, max);
  const sub = {
    name: field("name", 200),
    email: field("email", 320),
    company: field("company", 200),
    message: field("message", 5000),
  };
  if (!sub.name || !sub.message || !EMAIL.test(sub.email)) return null;
  return sub;
}

/** The Resend payload: to both founders, replies go straight to the visitor. */
export function email(sub: Submission, env: Env) {
  const from = sub.company ? `${sub.name} (${sub.company})` : sub.name;
  return {
    from: env.FROM,
    to: env.TO.split(",").map((a) => a.trim()),
    reply_to: sub.email,
    subject: `Website inquiry from ${from}`,
    text: [
      `Name: ${sub.name}`,
      `Email: ${sub.email}`,
      ...(sub.company ? [`Company: ${sub.company}`] : []),
      "",
      sub.message,
      "",
      "Sent from the colormath.com contact form. Reply to answer them directly.",
    ].join("\n"),
  };
}
