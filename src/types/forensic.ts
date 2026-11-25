export type VerdictType = "LOW RISK SIGNALS" | "LIKELY GHOST JOB" | "HIGH SCAM RISK";

export interface Receipt { title: string; url: string; snippet: string; }
export interface JobAlternative { role: string; company: string; location: string; apply_url: string; match_reason?: string; stipend_or_salary?: string; }
export interface CandidateProfile {
  fullName: string;
  experienceLevel: "Fresher / Student" | "Junior (1-2 yrs)" | "Mid-Level (3-5 yrs)" | "Senior (5+ yrs)";
  targetDomain: string;
  skills: string[];
  education: string;
  resumeText: string;
  fileName?: string;
}
export interface CandidateMatchItem { title: string; description: string; matched_skill?: string; risk_type?: "MISSING_SKILL" | "UNREASONABLE_EXPERIENCE" | "EXPLOITATION_RISK" | "DISGUISED_SENIOR"; }
export interface CandidateMatchAnalysis {
  fit_score: number;
  fit_verdict: "EXCELLENT MATCH" | "GOOD FIT WITH MINOR GAPS" | "STRETCH / SKILL GAP" | "EXPLOITATIVE EXPECTATIONS";
  summary: string;
  what_is_good: CandidateMatchItem[];
  what_is_bad: CandidateMatchItem[];
  matched_skills: string[];
  missing_skills: string[];
  tailored_action_items: string[];
}
export interface ForensicReport {
  verdict: VerdictType;
  legitimacy_score: number;
  company_name: string;
  role_title: string;
  summary: string;
  red_flags: string[];
  green_flags: string[];
  receipts: Receipt[];
  verified_alternatives: JobAlternative[];
  candidate_match?: CandidateMatchAnalysis;
  candidate_name?: string;
  audit_metadata?: { runtime_seconds?: number; domain_status?: string; domain_age?: string; repost_history_months?: number; python_checks_evaluated?: number; };
}
export interface InvestigateRequest { job_url?: string; raw_description?: string; company_name?: string; role_title?: string; candidate_profile?: CandidateProfile; resume_text?: string; }
export interface TerminalLog { id: string; timestamp: string; type: "stdout" | "stderr" | "system" | "python" | "success" | "warn"; text: string; }
