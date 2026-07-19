"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, LifeBuoy, Plus, Send, ChevronDown, ChevronUp,
  Clock, CheckCircle2, AlertCircle, XCircle, Loader2,
} from "lucide-react";
import RequireAuth from "@/components/ui/RequireAuth";
import BottomNav from "@/components/ui/BottomNav";
import { useSupport, CATEGORY_LABELS } from "@/hooks/useSupport";
import type { TicketCategory, SupportTicket } from "@/hooks/useSupport";

const CATEGORIES: TicketCategory[] = ["booking_issue", "payment", "driver_behaviour", "app_bug", "account", "other"];

const STATUS_ICON: Record<string, React.ReactNode> = {
  open:        <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />,
  in_progress: <Clock className="w-3.5 h-3.5 text-sky-400" />,
  resolved:    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />,
  closed:      <XCircle className="w-3.5 h-3.5 text-zinc-500" />,
};
const STATUS_STYLE: Record<string, string> = {
  open:        "bg-yellow-400/10 text-yellow-400",
  in_progress: "bg-sky-400/10 text-sky-400",
  resolved:    "bg-green-400/10 text-green-400",
  closed:      "bg-zinc-700/60 text-zinc-400",
};
const STATUS_LABEL: Record<string, string> = {
  open: "Open", in_progress: "In Progress", resolved: "Resolved", closed: "Closed",
};

function TicketCard({ ticket }: { ticket: SupportTicket }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      <button className="w-full text-left p-4" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white leading-tight truncate">{ticket.subject}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{CATEGORY_LABELS[ticket.category]} · {date}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${STATUS_STYLE[ticket.status]}`}>
              {STATUS_ICON[ticket.status]}
              {STATUS_LABEL[ticket.status]}
            </span>
            {expanded ? <ChevronUp className="w-4 h-4 text-zinc-600" /> : <ChevronDown className="w-4 h-4 text-zinc-600" />}
          </div>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800 pt-3 space-y-3">
          <div className="bg-zinc-800/60 rounded-xl p-3">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Your Message</p>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>
          {ticket.adminReply ? (
            <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-3">
              <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest mb-1">Support Reply</p>
              <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{ticket.adminReply}</p>
            </div>
          ) : (
            <p className="text-xs text-zinc-600 italic">Awaiting support team response…</p>
          )}
        </div>
      )}
    </div>
  );
}

function NewTicketForm({ onCreate, onCancel }: { onCreate: (cat: TicketCategory, sub: string, desc: string) => Promise<void>; onCancel: () => void }) {
  const [category, setCategory] = useState<TicketCategory>("booking_issue");
  const [subject, setSubject]   = useState("");
  const [desc, setDesc]         = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !desc.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await onCreate(category, subject.trim(), desc.trim());
      onCancel();
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? "Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5 space-y-4">
      <h2 className="text-white font-bold text-base">New Support Request</h2>

      <div>
        <label className="text-[11px] font-bold text-yellow-400 uppercase tracking-widest block mb-1.5">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as TicketCategory)}
          className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/30"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[11px] font-bold text-yellow-400 uppercase tracking-widest block mb-1.5">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          maxLength={120}
          placeholder="Brief summary of your issue"
          className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/30"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold text-yellow-400 uppercase tracking-widest block mb-1.5">Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
          rows={4}
          maxLength={1000}
          placeholder="Describe the issue in detail…"
          className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/30 resize-none"
        />
        <p className="text-right text-[10px] text-zinc-600 mt-1">{desc.length}/1000</p>
      </div>

      {error && <p className="text-red-400 text-xs bg-red-900/20 rounded-xl px-3 py-2">{error}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-2xl border border-zinc-700 text-zinc-300 text-sm font-semibold hover:bg-zinc-800 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !subject.trim() || !desc.trim()}
          className="flex-1 py-3 rounded-2xl bg-yellow-400 text-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-yellow-300 disabled:opacity-50 transition-colors"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {submitting ? "Sending…" : "Submit"}
        </button>
      </div>
    </form>
  );
}

function SupportContent() {
  const router = useRouter();
  const { tickets, loading, tableReady, createTicket } = useSupport("driver");
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 pt-10 pb-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => router.back()} className="text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <LifeBuoy className="w-5 h-5 text-yellow-400" />
            <h1 className="text-white font-bold text-lg">Help & Support</h1>
          </div>
          {!showForm && tableReady && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {!tableReady && (
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-4 text-center">
            <p className="text-yellow-300 text-sm font-semibold">Support system is being set up</p>
            <p className="text-yellow-400/70 text-xs mt-1">Please apply migration 027 in Supabase and try again.</p>
          </div>
        )}

        {showForm && (
          <NewTicketForm onCreate={createTicket} onCancel={() => setShowForm(false)} />
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-zinc-600 animate-spin" />
          </div>
        ) : tickets.length === 0 && !showForm ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <LifeBuoy className="w-8 h-8 text-zinc-600" />
            </div>
            <div>
              <p className="text-zinc-300 font-semibold">No support tickets yet</p>
              <p className="text-zinc-500 text-sm mt-1">Facing an issue? Raise a request and we'll help you out.</p>
            </div>
            {tableReady && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-colors"
              >
                <Plus className="w-4 h-4" /> Raise a Request
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => <TicketCard key={t.id} ticket={t} />)}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

export default function SupportPage() {
  return (
    <RequireAuth>
      <SupportContent />
    </RequireAuth>
  );
}
