import { CandidateProfile, CandidateMatchAnalysis, CandidateMatchItem, Receipt, JobAlternative, VerdictType } from "@/types/forensic";
import { extractSkillsFromText } from "./resume-data";
export interface ForensicAuditOutput { legitimacy_score: number; verdict: VerdictType; summary: string; red_flags: string[]; green_flags: string[]; receipts: Receipt[]; verified_alternatives: JobAlternative[]; domain_status: string; domain_age: string; repost_history_months?: number; candidate_match?: CandidateMatchAnalysis; }
export function performForensicAudit(company: string, role: string, jobUrl: string, rawDesc: string, candidateProfile?: CandidateProfile): ForensicAuditOutput {
  const text = `${company} ${role} ${jobUrl} ${rawDesc}`.toLowerCase();
  const redFlags: string[] = []; const greenFlags: string[] = []; let score = 70;
  const isInternFeeTrap = ["registration fee", "training fee", "certificate fee", "cloud fee", "security deposit", "nominal fee", "gpu access fee", "pay fee"].some((x) => text.includes(x));
  const isUnpaidInternship = (text.includes("unpaid") || text.includes("performance-based stipend")) && (text.includes("intern") || text.includes("fresher"));
  const isTelegramOrWhatsApp = ["telegram", "whatsapp", "t.me/", "wa.me/"].some((x) => text.includes(x));
  const isCheckFraudPattern = ["check will be mailed", "cashier's check", "purchase home office equipment", "approved vendor", "zelle", "cashapp", "crypto"].some((x) => text.includes(x));
  const isReposted = ["reposted", "months", "talent community", "talent pool", "evergreen"].some((x) => text.includes(x));
  if (isInternFeeTrap) { redFlags.push("Potential internship fee trap: the listing asks applicants to pay fees."); score -= 50; }
  if (isUnpaidInternship && !isInternFeeTrap) { redFlags.push("Unpaid or speculative performance-based internship compensation."); score -= 25; }
  if (isTelegramOrWhatsApp) { redFlags.push("Recruitment routed through messaging platforms rather than a verified corporate process."); score -= 40; }
  if (isCheckFraudPattern) { redFlags.push("Possible fake-check or advance-fee equipment scam pattern."); score -= 45; }
  if (isReposted) { redFlags.push("Listing text mentions reposting, evergreen hiring, or prolonged talent-pool collection."); score -= 25; }
  const vagueSalary = text.includes("competitive market rate") || text.includes("doe") || (!/[\$€£₹]/.test(text));
  if (vagueSalary && !isCheckFraudPattern && !isInternFeeTrap) { redFlags.push("Compensation details appear vague or absent."); score -= 15; }
  if (["rockstar", "wear many hats", "10x engineer", "fast-paced unicorn"].some((x) => text.includes(x))) { redFlags.push("Listing uses generic startup clichés."); score -= 10; }
  if (/\$\s*\d{2,3}(?:,\d{3})*\s*-\s*\$\s*\d{2,3}(?:,\d{3})*/i.test(rawDesc)) { greenFlags.push("A specific salary range is provided."); score += 20; }
  if (["greenhouse.io", "lever.co", "ashbyhq.com", "myworkdayjobs.com", "vercel.com", "google.com", "apple.com", "internshala.com", "wellfound.com", "indeed.com"].some((x) => jobUrl.includes(x)) && !isCheckFraudPattern && !isInternFeeTrap) { greenFlags.push("URL uses a recognized company or hiring platform domain; this is not independently verified."); score += 20; }
  if (["interview loop", "recruiter screen", "system design", "technical interview", "coding test"].some((x) => text.includes(x))) { greenFlags.push("A structured interview process is described."); score += 15; }
  score = Math.max(5, Math.min(98, score));
  const verdict: VerdictType = score <= 35 || isCheckFraudPattern || isTelegramOrWhatsApp || isInternFeeTrap ? "HIGH SCAM RISK" : score < 75 || isReposted ? "LIKELY GHOST JOB" : "LOW RISK SIGNALS";
  const summary = verdict === "HIGH SCAM RISK" ? "The listing text matches high-risk scam patterns. Do not send money or sensitive financial details to an unverified recruiter." : verdict === "LIKELY GHOST JOB" ? "The listing text matches signals sometimes seen in evergreen or speculative postings. Repost history was not independently checked." : "No major scam signals matched the listing text. This heuristic result does not verify the employer, domain, or job posting.";
  if (!redFlags.length) redFlags.push("No high-risk phrases matched the local screening rules.");
  if (!greenFlags.length) greenFlags.push("No positive verification signals were checked by the local rules engine.");
  const receipts: Receipt[] = [{ title: "FTC: How to spot and avoid job scams", url: "https://consumer.ftc.gov/articles/job-scams", snippet: "General consumer guidance; this reference does not independently verify the listing." }];
  if (jobUrl.startsWith("http")) receipts.unshift({ title: "Submitted job listing", url: jobUrl, snippet: "The URL supplied for screening. Local heuristic mode does not fetch or verify the page." });
  const isAIRole = /ai|intern|fresher|artificial intelligence|machine learning/i.test(role);
  const verified_alternatives: JobAlternative[] = isAIRole ? [
    { role: "Explore AI careers", company: "Cohere", location: "See company careers page", apply_url: "https://cohere.com/careers" },
    { role: "Explore machine learning careers", company: "Hugging Face", location: "See company careers page", apply_url: "https://huggingface.co/jobs" },
    { role: "Explore technology careers", company: "Cloudflare", location: "See company careers page", apply_url: "https://www.cloudflare.com/careers/jobs" },
  ] : [
    { role: "Explore engineering and technology careers", company: "Vercel", location: "See company careers page", apply_url: "https://vercel.com/careers" },
    { role: "Explore technology careers", company: "Cloudflare", location: "See company careers page", apply_url: "https://www.cloudflare.com/careers/jobs" },
    { role: "Explore company careers", company: "GitLab", location: "See company careers page", apply_url: "https://about.gitlab.com/jobs/all-jobs" },
  ];
  let candidate_match: CandidateMatchAnalysis | undefined;
  if (candidateProfile) {
    const resume = (candidateProfile.resumeText || "").toLowerCase(); const candidateSkills = (candidateProfile.skills || []).map((s) => s.toLowerCase());
    const jobSkills = extractSkillsFromText(rawDesc || role); const matched = jobSkills.filter((s) => candidateSkills.some((c) => c.includes(s.toLowerCase()) || s.toLowerCase().includes(c)) || resume.includes(s.toLowerCase()));
    const missing = jobSkills.filter((s) => !matched.includes(s)); const good: CandidateMatchItem[] = []; const bad: CandidateMatchItem[] = [];
    if (matched.length) good.push({ title: `Technical alignment (${matched.slice(0, 4).join(", ")})`, description: `Your profile contains skills also found in the supplied listing: ${matched.slice(0, 4).join(", ")}.`, matched_skill: matched[0] });
    if (isInternFeeTrap) bad.push({ title: "Potential fee exploitation", description: "The listing text asks candidates to pay a fee. Verify independently and do not send money to recruiters.", risk_type: "EXPLOITATION_RISK" });
    if (missing.length) bad.push({ title: `Potential skill gaps: ${missing.slice(0, 3).join(", ")}`, description: "These listing terms were not detected in the supplied profile; keyword matching can miss equivalent experience.", risk_type: "MISSING_SKILL" });
    const fitScore = Math.max(10, Math.min(95, Math.round((matched.length / Math.max(1, jobSkills.length)) * 80) + 15));
    candidate_match = { fit_score: fitScore, fit_verdict: isInternFeeTrap ? "EXPLOITATIVE EXPECTATIONS" : fitScore >= 80 ? "EXCELLENT MATCH" : fitScore < 50 ? "STRETCH / SKILL GAP" : "GOOD FIT WITH MINOR GAPS", summary: `The text matcher found ${matched.length} overlapping skills. This is a rough keyword comparison, not a hiring assessment.`, what_is_good: good, what_is_bad: bad, matched_skills: matched, missing_skills: missing, tailored_action_items: ["Tailor your project summary to highlight relevant experience.", ...(missing.length ? [`Review whether you have experience relevant to ${missing[0]}.`] : []), ...(isInternFeeTrap ? ["Do not pay an application, training, or equipment fee."] : ["Apply through the company's official careers page and verify the opening."])] };
  }
  return { legitimacy_score: score, verdict, summary, red_flags: redFlags, green_flags: greenFlags, receipts, verified_alternatives, domain_status: "Not checked (local rules only)", domain_age: "Not checked", candidate_match };
}
