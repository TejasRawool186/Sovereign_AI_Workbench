"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  Mic,
  MicOff,
  ArrowRight,
  X,
  FileText,
  Loader2,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { AttachedFile } from "@/types/chat";
import { SlashCommandMenu, SlashCommand } from "./SlashCommandMenu";
import { formatBytes } from "@/lib/utils";

interface ComposerProps {
  onSendMessage: (content: string, attachments: AttachedFile[]) => void;
}

export function Composer({ onSendMessage }: ComposerProps) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [slashFilter, setSlashFilter] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isExecuting } = useTaskStore();

  // Auto-expand textarea up to 180px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [content]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    setSlashFilter(val.startsWith("/") ? val.slice(1) : null);
  };

  const handleSelectSlashCommand = (cmd: SlashCommand) => {
    setContent(cmd.prompt);
    setSlashFilter(null);
    if (cmd.key === "ut-audit" && !attachments.some((a) => a.name.includes("hydrocracker"))) {
      setAttachments((prev) => [
        ...prev,
        { id: `att-${Date.now()}`, name: "hydrocracker_ut_log.pdf", size: 2450000, type: "application/pdf" },
      ]);
    }
    textareaRef.current?.focus();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newAttachments: AttachedFile[] = Array.from(files).map((file) => ({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (id: string) =>
    setAttachments((prev) => prev.filter((a) => a.id !== id));

  const handleVoiceToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setContent("Analyze the pump P-102B vibration frequency spectrum and flag bearing outer race defects.");
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!content.trim() && attachments.length === 0) || isExecuting) return;
    onSendMessage(content.trim(), attachments);
    setContent("");
    setAttachments([]);
    setSlashFilter(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && slashFilter === null) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = (content.trim() || attachments.length > 0) && !isExecuting;

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 pb-5 select-none">
      {slashFilter !== null && (
        <SlashCommandMenu
          filter={slashFilter}
          onSelect={handleSelectSlashCommand}
          onClose={() => setSlashFilter(null)}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.xlsx,.docx,.json"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div
        className="rounded-xl transition-all"
        style={{
          background: "var(--wb-surface-card)",
          border: "1px solid var(--wb-border-medium)",
          boxShadow: "0 -1px 12px rgba(0,0,0,0.15)",
        }}
        onFocus={() => {}}
      >
        {/* Attachment chips */}
        {attachments.length > 0 && (
          <div
            className="flex flex-wrap gap-2 px-4 pt-3"
            style={{ borderBottom: "1px solid var(--wb-border-subtle)" }}
          >
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px]"
                style={{
                  background: "var(--wb-surface)",
                  border: "1px solid var(--wb-border-subtle)",
                  color: "var(--wb-text-sec)",
                }}
              >
                <FileText className="w-3 h-3 shrink-0" style={{ color: "var(--wb-teal)" }} />
                <span className="font-medium truncate max-w-[160px]">{file.name}</span>
                <span style={{ color: "var(--wb-text-muted)" }}>({formatBytes(file.size)})</span>
                <button
                  onClick={() => removeAttachment(file.id)}
                  className="p-0.5 rounded transition-colors"
                  style={{ color: "var(--wb-text-muted)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--wb-danger)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--wb-text-muted)")}
                  aria-label="Remove attachment"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={2}
          value={content}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Start an industrial analysis task — attach inspection files, describe findings, or type / for workflows…"
          className="w-full bg-transparent px-4 py-3.5 text-[14.5px] focus:outline-none resize-none leading-relaxed"
          style={{
            color: "var(--wb-text)",
            minHeight: "56px",
            maxHeight: "180px",
          }}
          aria-label="Task input"
        />

        {/* Bottom action bar */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderTop: "1px solid var(--wb-border-subtle)" }}
        >
          {/* Left: attach + voice */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--wb-text-muted)" }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "var(--wb-surface-hover)";
                e.currentTarget.style.color = "var(--wb-text-sec)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--wb-text-muted)";
              }}
              title="Attach inspection file"
              aria-label="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleVoiceToggle}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: isRecording ? "var(--wb-danger)" : "var(--wb-text-muted)",
                background: isRecording ? "rgba(228,106,106,0.10)" : "transparent",
              }}
              onMouseEnter={e => {
                if (!isRecording) {
                  e.currentTarget.style.background = "var(--wb-surface-hover)";
                  e.currentTarget.style.color = "var(--wb-text-sec)";
                }
              }}
              onMouseLeave={e => {
                if (!isRecording) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--wb-text-muted)";
                }
              }}
              title={isRecording ? "Stop recording" : "Voice dictation (Whisper)"}
              aria-label={isRecording ? "Stop recording" : "Start voice input"}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Right: hint + run button */}
          <div className="flex items-center gap-3">
            {!isExecuting && (
              <span
                className="hidden sm:block text-[11px] font-mono"
                style={{ color: "var(--wb-text-muted)" }}
              >
                Enter to run · Shift+Enter for new line
              </span>
            )}

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!canSend}
              className="flex items-center gap-1.5 px-4 h-8 rounded-lg text-[12.5px] font-semibold transition-all"
              style={{
                background: canSend ? "var(--wb-teal)" : "var(--wb-surface-hover)",
                color: canSend ? "#07151D" : "var(--wb-text-muted)",
                cursor: canSend ? "pointer" : "not-allowed",
                border: "none",
              }}
              aria-label="Run task"
            >
              {isExecuting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  Run Task
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
