"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Paperclip, Sparkles, Wand2, X } from "lucide-react";
import { VISION_IDEAS, VISION_MAX_LENGTH } from "./builder-data";
import { PRIMARY_BUTTON, StepFooter } from "./step-chrome";

export type VisionData = { text: string; attachmentName?: string };

/* Browser speech recognition (Chrome/Edge/Safari expose it with a webkit prefix). */
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function speechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const TEXT_FILE = /\.(txt|md|markdown|csv)$/i;

/** Adds text as a new sentence and keeps the result within the length limit. */
function append(base: string, extra: string) {
  const start = base.trimEnd();
  const joined = start ? `${start}${/[.!?]$/.test(start) ? "" : "."} ${extra.trim()}` : extra.trim();
  return joined.slice(0, VISION_MAX_LENGTH);
}

/** "Tell us a bit more about your vision": optional free text the project is generated from. */
export default function VisionStep({
  initial,
  enhanceContext,
  generating,
  onBack,
  onGenerate,
}: {
  initial?: VisionData;
  /** Facts from the earlier steps that "Enhance Prompt" adds to the description. */
  enhanceContext: string[];
  generating: boolean;
  /** Gets the current text, so it is kept when coming back. */
  onBack: (vision: VisionData) => void;
  onGenerate: (vision: VisionData) => void;
}) {
  const [text, setText] = useState(initial?.text ?? "");
  const [attachmentName, setAttachmentName] = useState(initial?.attachmentName);
  const [enhancing, setEnhancing] = useState(false);
  const [listening, setListening] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Stop listening when leaving the page.
  useEffect(() => () => recognitionRef.current?.stop(), []);

  const enhance = () => {
    if (enhancing) return;
    const missing = enhanceContext.filter((fact) => !text.includes(fact));
    if (!missing.length) {
      setNotice("Your description already includes everything from the earlier steps.");
      return;
    }
    setEnhancing(true);
    setNotice(null);
    // A short pause so the change is noticeable; the details come from the earlier steps.
    window.setTimeout(() => {
      setText((current) => append(current, missing.join(" ")));
      setEnhancing(false);
      setNotice("Added details from your earlier choices. Edit anything that isn't right.");
    }, 650);
  };

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const Recognition = speechRecognition();
    if (!Recognition) {
      setNotice("Voice input isn't available in this browser. Try Chrome, Edge or Safari.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = navigator.language || "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;
    recognition.onresult = (event) => {
      let heard = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) heard += event.results[i][0].transcript;
      }
      if (heard.trim()) setText((current) => append(current, heard));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      setNotice("Couldn't hear you. Check microphone permissions and try again.");
    };
    recognitionRef.current = recognition;
    setNotice(null);
    setListening(true);
    recognition.start();
  };

  const attach = async (file: File) => {
    setAttachmentName(file.name);
    if (TEXT_FILE.test(file.name) || file.type.startsWith("text/")) {
      const contents = (await file.text()).replace(/\s+/g, " ").trim();
      if (contents) {
        setText((current) => append(current, contents));
        setNotice(`Added the text from ${file.name}.`);
        return;
      }
    }
    setNotice(`${file.name} is attached and will be used when your project is generated.`);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#0040DF]">
          <Sparkles className="h-3.5 w-3.5" /> AI Personalization Engine
        </span>
        <span className="rounded-full bg-[#E8EBF7] px-2 py-0.5 text-[10px] font-medium text-slate-600">Optional step</span>
      </div>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-[28px]">Tell us a bit more about your vision</h1>
      <p className="mt-1 max-w-3xl text-sm text-slate-500">
        Provide a quick overview of your product, audience, or special requirements. Our AI will use this context to
        customize screen copy, transaction types, onboarding steps, and default settings. Feel free to skip if you
        prefer standard defaults.
      </p>

      <div className="mt-12 rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)] focus-within:border-[#0040DF]/50 md:mt-24">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={VISION_MAX_LENGTH}
          rows={5}
          aria-label="Describe your product"
          placeholder="We are building an all-in-one financial app for independent creators and freelance consultants across the US and Europe. Our customers need multi-currency accounts (USD, EUR, GBP), automated 25% tax vault withholding on incoming client invoices, instant virtual cards for software subscriptions, and friendly, jargon-free micro-copy."
          className="block w-full resize-none rounded-t-xl bg-transparent px-4 pb-2 pt-4 text-[13px] leading-relaxed text-slate-800 outline-none placeholder:text-slate-400"
        />
        {attachmentName && (
          <div className="px-4 pb-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600">
              <Paperclip className="h-3 w-3" /> {attachmentName}
              <button type="button" aria-label="Remove attachment" onClick={() => setAttachmentName(undefined)} className="rounded hover:text-slate-900">
                <X className="h-3 w-3" />
              </button>
            </span>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={enhance}
              disabled={enhancing}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF2FF] px-2.5 py-1.5 text-xs font-medium text-[#0040DF] transition-colors hover:bg-[#E3E8FF]"
            >
              {enhancing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />} Enhance Prompt
            </button>
            <button
              type="button"
              onClick={toggleVoice}
              aria-pressed={listening}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                listening ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Mic className={`h-3.5 w-3.5 ${listening ? "animate-pulse" : ""}`} /> {listening ? "Listening… tap to stop" : "Voice Input"}
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
            >
              <Paperclip className="h-3.5 w-3.5" /> Attach Doc
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.markdown,.csv,.pdf,.doc,.docx"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void attach(file);
              }}
            />
          </div>
          <span className="text-[11px] text-slate-400">
            {text.length.toLocaleString()} / {VISION_MAX_LENGTH.toLocaleString()} characters
          </span>
        </div>
      </div>

      <p role="status" className="mt-2 min-h-4 text-[11px] text-slate-500">{notice}</p>

      <div className="mt-1 flex flex-wrap gap-2">
        {VISION_IDEAS.map((idea) => (
          <button
            key={idea.text}
            type="button"
            onClick={() => {
              setText(idea.text);
              setNotice(null);
              textareaRef.current?.focus();
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-[#F7F8FC] px-2.5 py-1.5 text-[11px] text-slate-600 transition-colors hover:border-slate-300 hover:bg-white"
          >
            <span aria-hidden>{idea.emoji}</span> {idea.text}
          </button>
        ))}
      </div>

      <div className="mt-16">
        <StepFooter
          backLabel="Back to personalization"
          onBack={() => {
            recognitionRef.current?.stop();
            onBack({ text, attachmentName });
          }}
          primary={
            <button
              type="button"
              disabled={generating}
              onClick={() => {
                recognitionRef.current?.stop();
                onGenerate({ text: text.trim(), attachmentName });
              }}
              className={PRIMARY_BUTTON}
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate Project with AI
            </button>
          }
          note="We will synthesize your full project architecture, data contracts, and client screen layouts based on your selections"
        />
      </div>
    </div>
  );
}
