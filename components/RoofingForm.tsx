"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FORM_CONFIG, FormStep } from "../config/questions";

type FormAnswers = Record<string, string | number | boolean>;

export default function RoofingForm() {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [formData, setFormData] = useState<FormAnswers>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const currentStep: FormStep = FORM_CONFIG.steps[stepIndex];
  const progress = ((stepIndex + 1) / FORM_CONFIG.steps.length) * 100;

  const handleNext = async (value?: string) => {
    const updatedData = { ...formData };
    if (value) updatedData[currentStep.id] = value;
    setFormData(updatedData);

    if (stepIndex < FORM_CONFIG.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setIsCalculating(true);
      setTimeout(() => submitToN8N(updatedData), 1800);
    }
  };

  const submitToN8N = async (finalData: FormAnswers) => {
    setLoading(true);
    try {
      await fetch(FORM_CONFIG.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...finalData,
          source: "Roofing Website Template",
          timestamp: new Date().toISOString(),
        }),
      });

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#dc2626", "#ffffff", "#1e293b"],
      });

      setSubmitted(true);
    } catch (err) {
      alert("Submission error. Please check your connection.");
    } finally {
      setLoading(false);
      setIsCalculating(false);
    }
  };

  if (isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-center px-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-4 text-brand"
        >
          <Sparkles
            size={50}
            strokeWidth={1.5}
          />
        </motion.div>
        <h2 className="text-xl font-bold mb-2">Generating Estimate...</h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          Matching local rates...
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-card border rounded-[2rem] shadow-2xl max-w-md mx-auto"
      >
        <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-4 border border-brand/20">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-black mb-2 text-foreground uppercase italic tracking-tight">
          Request Sent!
        </h2>
        <p className="text-muted-foreground text-sm mb-6 leading-tight">
          Thanks,{" "}
          <span className="text-foreground font-bold">
            {String(formData.firstName || "User")}
          </span>
          ! We will call you at{" "}
          <span className="text-foreground font-bold">
            {String(formData.phone || "")}
          </span>{" "}
          shortly.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-brand text-white rounded-xl font-black text-sm hover:brightness-110 shadow-lg shadow-brand/20"
        >
          BACK TO HOME
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4">
      {/* Mini Header */}
      <div className="mb-6 text-center">
        <h1 className="text-xl md:text-2xl font-black mb-3 uppercase tracking-tighter italic">
          Roof <span className="text-brand">Savings</span> 2026
        </h1>
        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden max-w-[200px] mx-auto border border-border">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full bg-brand"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-card backdrop-blur-2xl border rounded-[2rem] p-6 md:p-8 shadow-2xl min-h-[400px] flex flex-col relative overflow-hidden"
        >
          <h2 className="text-lg md:text-xl font-bold text-center mb-6 text-foreground leading-tight">
            {currentStep.question}
          </h2>

          <div className="flex-grow flex flex-col justify-center">
            {currentStep.type === "choice" && (
              <div className="grid grid-cols-2 gap-3">
                {currentStep.options?.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleNext(opt.value)}
                    className="flex flex-col items-center justify-center p-4 bg-muted/40 border border-transparent rounded-2xl hover:border-brand hover:bg-brand/5 transition-all group active:scale-[0.96]"
                  >
                    <opt.icon
                      className="mb-2 text-muted-foreground group-hover:text-brand transition-all"
                      size={28}
                      strokeWidth={1.5}
                    />
                    <span className="font-bold text-xs text-center uppercase tracking-tight text-foreground/70 group-hover:text-foreground">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {(currentStep.type === "text" || currentStep.type === "phone") && (
              <div className="space-y-3 w-full max-w-sm mx-auto">
                {currentStep.fields?.map((f) => (
                  <input
                    key={f.id}
                    type={currentStep.type === "phone" ? "tel" : "text"}
                    placeholder={f.placeholder}
                    className="w-full h-12 px-5 bg-muted/50 border border-border rounded-xl focus:border-brand focus:outline-none text-base text-foreground"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [f.id]: e.target.value,
                      }))
                    }
                    value={(formData[f.id] as string) || ""}
                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  />
                ))}
                <button
                  disabled={loading}
                  onClick={() => handleNext()}
                  className="w-full h-12 bg-brand text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand/20 active:scale-[0.98] mt-2 uppercase"
                >
                  {loading ? (
                    <Loader2
                      className="animate-spin"
                      size={18}
                    />
                  ) : (
                    <>
                      {stepIndex === FORM_CONFIG.steps.length - 1
                        ? "Get Quote"
                        : "Next Step"}
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Mini Navigation */}
          <div className="mt-6 flex justify-between items-center border-t border-border/50 pt-4">
            {stepIndex > 0 ? (
              <button
                onClick={() => setStepIndex(stepIndex - 1)}
                className="flex items-center text-muted-foreground hover:text-brand font-bold text-[10px] uppercase tracking-widest"
              >
                <ChevronLeft
                  size={14}
                  className="mr-1"
                />{" "}
                Back
              </button>
            ) : (
              <div />
            )}
            <span className="text-muted-foreground font-mono text-[10px] font-bold bg-muted px-2 py-0.5 rounded-md border border-border">
              {stepIndex + 1}/{FORM_CONFIG.steps.length}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
