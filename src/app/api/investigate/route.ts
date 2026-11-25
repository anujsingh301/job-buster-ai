import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { performForensicAudit } from "@/lib/forensic-engine";
import { ForensicReport, InvestigateRequest } from "@/types/forensic";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  let body: InvestigateRequest;
  try { body = await req.json(); } catch { return Response.json({ error: "Invalid JSON body" }, { status: 400 }); }
  const { job_url = "", raw_description = "", company_name = "", role_title = "", candidate_profile } = body;
  if (!job_url && !raw_description) return Response.json({ error: "Please provide a job listing URL or job description" }, { status: 400 });
  let company = company_name || raw_description.match(/company:\s*([^\n\r]+)/i)?.[1]?.trim() || "Target Organization";
  let role = role_title || raw_description.match(/(?:role|title):\s*([^\n\r]+)/i)?.[1]?.trim() || "Software Engineer";
  if (job_url) { try { const url = new URL(job_url); if (url.protocol !== "https:" && url.protocol !== "http:") return Response.json({ error: "Only HTTP(S) job URLs are accepted" }, { status: 400 }); if (!company_name && url.hostname.includes("vercel.com")) company = "Vercel Inc."; const slug = url.pathname.match(/\/jobs\/view\/(?:\d+-)?([a-z0-9-]+)/i)?.[1]; if (!role_title && slug) role = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "); } catch { return Response.json({ error: "Please provide a valid job URL" }, { status: 400 }); } }
  const encoder = new TextEncoder();
  const stream = new ReadableStream({ async start(controller) {
    const send = (event: { type: "status" | "verdict" | "error"; message?: string; logType?: "stdout" | "system" | "success" | "warn" | "stderr"; report?: ForensicReport }) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
    try {
      send({ type: "status", logType: "system", message: "> Preparing supplied listing and profile..." });
      let report: ForensicReport | null = null; const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey?.trim()) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: `Analyze only the supplied job listing text for common scam/ghost-job indicators and resume keyword overlap. Do not claim to browse, verify domains, or confirm current openings. Return valid JSON with verdict, legitimacy_score, company_name, role_title, summary, red_flags, green_flags, receipts, verified_alternatives.\nCompany: ${company}\nRole: ${role}\nURL: ${job_url}\nDescription: ${raw_description}\nCandidate: ${candidate_profile ? `${candidate_profile.fullName}; skills: ${candidate_profile.skills.join(", ")}; resume: ${candidate_profile.resumeText.slice(0, 1500)}` : "not provided"}` });
          const raw = response.text || ""; const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/); const parsed = JSON.parse(match?.[1] || raw);
          if (parsed && typeof parsed.legitimacy_score === "number") report = { ...parsed, company_name: parsed.company_name || company, role_title: parsed.role_title || role, receipts: parsed.receipts || [], verified_alternatives: parsed.verified_alternatives || [], red_flags: parsed.red_flags || [], green_flags: parsed.green_flags || [], audit_metadata: { domain_status: "Not independently checked", domain_age: "Not checked" } } as ForensicReport;
        } catch { send({ type: "status", logType: "warn", message: "> Gemini analysis unavailable; using local text heuristics." }); }
      } else send({ type: "status", logType: "stdout", message: "> GEMINI_API_KEY not configured; using local text heuristics." });
      if (!report) { const audit = performForensicAudit(company, role, job_url, raw_description, candidate_profile); report = { verdict: audit.verdict, legitimacy_score: audit.legitimacy_score, company_name: company, role_title: role, summary: audit.summary, red_flags: audit.red_flags, green_flags: audit.green_flags, receipts: audit.receipts, verified_alternatives: audit.verified_alternatives, candidate_match: audit.candidate_match, candidate_name: candidate_profile?.fullName, audit_metadata: { domain_status: audit.domain_status, domain_age: audit.domain_age } }; }
      send({ type: "status", logType: "success", message: "> Screening complete. Results are not independent verification." }); send({ type: "verdict", report }); controller.close();
    } catch (error) { send({ type: "error", logType: "stderr", message: error instanceof Error ? error.message : "Analysis failed" }); controller.close(); }
  } });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" } });
}
