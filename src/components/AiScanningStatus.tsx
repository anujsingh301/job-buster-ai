"use client";
import React from "react";
import { TerminalLog } from "@/types/forensic";
import LiveTerminal from "./LiveTerminal";
export function AiScanningStatus({ logs, isInvestigating, activeStep, candidateName = "Candidate" }: { logs: TerminalLog[]; isInvestigating: boolean; activeStep?: string; candidateName?: string }) {
  return <section className="w-full space-y-3 rounded-2xl border border-cyan-800/40 bg-[#0d0e17] p-6"><h2 className="font-bold text-white">Analyzing listing and resume compatibility</h2><p className="text-sm text-zinc-400">{activeStep || `${candidateName}: reviewing the supplied listing and profile.`}</p><LiveTerminal logs={logs} isInvestigating={isInvestigating} activeStep={activeStep} /></section>;
}
