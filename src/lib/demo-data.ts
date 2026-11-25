export interface DemoSample { id: string; label: string; category: "ghost" | "legit" | "scam"; badge: string; badgeColor: string; company_name: string; role_title: string; job_url: string; raw_description: string; }
export const DEMO_SAMPLES: DemoSample[] = [
  { id: "ghost-job-sample", label: "Suspicious Ghost Job", category: "ghost", badge: "LIKELY GHOST JOB", badgeColor: "amber", company_name: "ApexScale Solutions", role_title: "Senior Staff Full Stack Engineer", job_url: "https://www.linkedin.com/jobs/view/3892019482-senior-staff-full-stack-engineer", raw_description: `Company: ApexScale Solutions
Role: Senior Staff Full Stack Engineer (Remote - US/Global)
Salary: Competitive market rate based on experience, equity package DOE
Status: Reposted 8 times across 7 months on LinkedIn & Indeed
We are urgently seeking a 10x rockstar engineer. You will wear many hats and build resilient distributed systems. Requirements: 8+ years software engineering experience.` },
  { id: "legit-job-sample", label: "Verified Legit Listing", category: "legit", badge: "LOW RISK SIGNALS", badgeColor: "emerald", company_name: "Vercel Inc.", role_title: "Staff Infrastructure Engineer - Edge Systems", job_url: "https://vercel.com/careers/staff-infrastructure-engineer", raw_description: `Company: Vercel Inc.
Role: Staff Infrastructure Engineer - Edge Systems
Location: Remote (US / Canada / EU)
Base Salary Range: $210,000 - $275,000 USD + Equity + 401(k) Match + Health Benefits
Published: 12 days ago on vercel.com/careers
Standard transparent interview loop: Recruiter screen -> 45-min System Design -> Take-home/Pairing -> Team & Values screen.` },
  { id: "scam-job-sample", label: "High Scam Risk", category: "scam", badge: "HIGH SCAM RISK", badgeColor: "crimson", company_name: "Global Logistics Data Services Ltd.", role_title: "Remote Executive Data Entry & Administrative Assistant", job_url: "https://t.me/GlobalDataCareers/apply-remote-admin", raw_description: `URGENT HIRING: Remote Executive Data Entry Clerk / Virtual Assistant
Pay: $52.00 / hour. NO EXPERIENCE REQUIRED!
A cashier's check of $2,850 will be mailed to you to purchase software from our vendor. Send a direct message on Telegram or WhatsApp for an interview.` },
];
