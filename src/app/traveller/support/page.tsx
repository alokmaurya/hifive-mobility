"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, LifeBuoy, Plus, Send, ChevronDown, ChevronUp,
  Clock, CheckCircle2, AlertCircle, XCircle, Loader2,
} from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useSupport, CATEGORY_LABELS } from "@/hooks/useSupport";
import type { TicketCategory, SupportTicket } from "@/hooks/useSupport";

const CATEGORIES: TicketCategory[] = ["booking_issue", "payment", "driver_behaviour", "app_bug", "account", "other"];

const STATUS_ICON: Record<string, React.ReactNode> = {
  open:        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />,
  in_progress: <Clock className="w-3.5 h-3.5 text-sky-500" />,
  resolved:    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />,
  closed:      <XCircle className="w-3.5 h-3.5 text-slate-400" />,
};
const STATUS_STYLE: Record<string, string> = {
  open:        "bg-amber-50 text-amber-600 border border-amber-200",
  in_progress: "bg-sky-50 text-sky-600 border border-sky-200",
  resolved:    "bg-green-50 text-green-600 border border-green-200",
  closed:      "bg-slate-100 text-slate-500 border border-slate-200",
};
const STATUS_LABEL: Record<string, string> = {
  open: "Open", in_progress: "In Progress", resolved: "Resolved", closed: "Closed",
};

function TicketCard({ ticket }: { ticket: SupportTicket }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <button className="w-full text-left p-4" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 leading-tight truncate">{ticket.subject}</p>
            <p className="text-xs text-slate-400 mt-0.5">{CATEGORY_LABELS[ticket.category]} · {date}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${STATUS_STYLE[ticket.status]}`}>
              {STATUS_ICON[ticket.status]}
              {STATUS_LABEL[ticket.status]}
            </span>
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
          </div>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Your Message</p>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>
          {ticket.adminReply ? (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Support Reply</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.adminReply}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Awaiting support team response…</p>
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
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
      <h2 className="text-slate-900 font-bold text-base">New Support Request</h2>

      <div>
        <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block mb-1.5">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as TicketCategory)}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block mb-1.5">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          maxLength={120}
          placeholder="Brief summary of your issue"
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block mb-1.5">Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
          rows={4}
          maxLength={1000}
          placeholder="Describe the issue in detail…"
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 resize-none"
        />
        <p className="text-right text-[10px] text-slate-400 mt-1">{desc.length}/1000</p>
      </div>

      {error && <p className="text-red-500 text-xs bg-red-50 rounded-xl px-3 py-2">{error}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !subject.trim() || !desc.trim()}
          className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md shadow-indigo-100"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {submitting ? "Sending…" : "Submit"}
        </button>
      </div>
    </form>
  );
}

export default function TravellerSupportPage() {
  const router = useRouter();
  const { tickets, loading, createTicket } = useSupport("traveller");
  const [showForm, setShowForm] = useState(false);

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-4 pt-10 pb-5">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <button onClick={() => router.back()} className="text-blue-300 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 flex-1">
              <LifeBuoy className="w-5 h-5 text-indigo-300" />
              <h1 className="text-white font-bold text-lg">Help & Support</h1>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <Plus className="w-3.5 h-3.5" /> New
              </button>
            )}
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
          {showForm && (
            <NewTicketForm onCreate={createTicket} onCancel={() => setShowForm(false)} />
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
            </div>
          ) : tickets.length === 0 && !showForm ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                <LifeBuoy className="w-8 h-8 text-indigo-300" />
              </div>
              <div>
                <p className="text-slate-700 font-semibold">No support tickets yet</p>
                <p className="text-slate-400 text-sm mt-1">Facing an issue? Raise a request and we'll help you out.</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md shadow-indigo-100"
              >
                <Plus className="w-4 h-4" /> Raise a Request
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => <TicketCard key={t.id} ticket={t} />)}
            </div>
          )}
        </div>
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
