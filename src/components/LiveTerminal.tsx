"use client";
import React from "react";
import { TerminalLog } from "@/types/forensic";
interface Props { logs: TerminalLog[]; isInvestigating: boolean; activeStep?: string; }
export default function LiveTerminal({ logs, isInvestigating, activeStep }: Props) {
  return <section className="w-full rounded-xl border border-zinc-800 bg-[#090a10] p-4 font-mono text-xs text-zinc-300" aria-live="polite">
    <p className="mb-3 text-cyan-400">Job Buster • {activeStep || (isInvestigating ? "Analysis in progress" : "Session log")}</p>
    <div className="max-h-80 space-y-2 overflow-y-auto">{logs.map((log) => <p key={log.id} className={log.type === "stderr" ? "text-red-400" : log.type === "warn" ? "text-amber-400" : ""}>{log.timestamp} {log.text}</p>)}{isInvestigating && <p className="text-emerald-400">Screening the supplied inputs…</p>}</div>
  </section>;
}
