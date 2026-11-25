import { CandidateProfile } from "@/types/forensic";

export const DEFAULT_FRESHER_RESUME: CandidateProfile = {
  fullName: "Candidate",
  experienceLevel: "Fresher / Student",
  targetDomain: "Artificial Intelligence & Machine Learning",
  education: "B.Tech in Computer Science & AI (2021–2025) • CGPA: 8.7/10.0",
  skills: ["Python", "PyTorch", "Hugging Face", "LangChain", "Large Language Models (LLMs)", "Retrieval-Augmented Generation (RAG)", "Fine-Tuning (LoRA/QLoRA)", "Scikit-Learn", "FastAPI", "Docker", "SQL", "Git"],
  fileName: "demo_resume.pdf",
  resumeText: `Aryan Sharma
Email: aryan.sharma.dev@gmail.com | Phone: +91 98765 43210
GitHub: github.com/aryansharma-ai | LinkedIn: linkedin.com/in/aryansharma-ai
Portfolio: aryansharma.ai

EDUCATION
Bachelor of Technology in Computer Science & Artificial Intelligence (2021 – 2025)
National Institute of Technology | CGPA: 8.7/10.0
Key Coursework: Deep Learning, Natural Language Processing, Linear Algebra, Distributed Computing

TECHNICAL SKILLS
- Programming: Python, C++, SQL, Bash
- AI / ML Stack: PyTorch, Hugging Face Transformers, LangChain, Llama-Index, Scikit-Learn
- Deployment & Backend: FastAPI, Docker, Ray, REST APIs, Git, Linux
- Domains: Generative AI, RAG Architectures, Parameter-Efficient Fine-Tuning (PEFT/LoRA), Computer Vision

ACADEMIC PROJECTS
1. Multi-Document Autonomous RAG System (Python, LangChain, FAISS, Llama-3)
2. Parameter-Efficient Fine-Tuning of Llama-3-8B on Medical QA (PyTorch, Unsloth, QLoRA)
3. Open-Source Contributions to Hugging Face model evaluation pipelines and documentation.`,
};

export const COMMON_SKILLS_DICTIONARY = ["python", "pytorch", "tensorflow", "keras", "scikit-learn", "langchain", "hugging face", "llm", "llms", "rag", "docker", "kubernetes", "fastapi", "flask", "django", "sql", "postgresql", "mongodb", "git", "linux", "aws", "gcp", "azure", "c++", "java", "typescript", "javascript", "react", "next.js", "node.js", "rest api", "graphql", "spark", "pandas", "numpy", "tableau", "power bi", "hadoop", "kafka", "computer vision", "nlp", "deep learning", "machine learning", "data science"];

export function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const matched = new Set<string>();
  for (const skill of COMMON_SKILLS_DICTIONARY) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i");
    if (regex.test(lower)) matched.add(skill.charAt(0).toUpperCase() + skill.slice(1));
  }
  return Array.from(matched);
}
