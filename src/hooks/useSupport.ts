"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export type TicketCategory = "booking_issue" | "payment" | "driver_behaviour" | "app_bug" | "account" | "other";
export type TicketStatus   = "open" | "in_progress" | "resolved" | "closed";
export type UserRole       = "driver" | "traveller";

export interface SupportTicket {
  id: string;
  userId: string;
  userRole: UserRole;
  category: TicketCategory;
  subject: string;
  description: string;
  status: TicketStatus;
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

function mapTicket(row: Record<string, unknown>): SupportTicket {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    userRole: row.user_role as UserRole,
    category: row.category as TicketCategory,
    subject: row.subject as string,
    description: row.description as string,
    status: row.status as TicketStatus,
    adminReply: (row.admin_reply as string) || undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  booking_issue:    "Booking Issue",
  payment:          "Payment",
  driver_behaviour: "Driver Behaviour",
  app_bug:          "App Bug",
  account:          "Account",
  other:            "Other",
};

export function useSupport(role: UserRole) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableReady, setTableReady] = useState(true);

  const fetchTickets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("support_tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      // Table may not exist yet — migration pending
      if (error.message?.includes("support_tickets") || error.code === "42P01") {
        setTableReady(false);
      }
      setLoading(false);
      return;
    }
    setTableReady(true);
    setTickets(((data ?? []) as Record<string, unknown>[]).map(mapTicket));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  async function createTicket(category: TicketCategory, subject: string, description: string) {
    if (!user) throw new Error("Not authenticated");
    if (!tableReady) throw new Error("Support system is being set up. Please try again in a few minutes.");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("support_tickets").insert({
      user_id: user.id,
      user_role: role,
      category,
      subject,
      description,
      status: "open",
    });
    if (error) {
      if (error.message?.includes("support_tickets") || error.code === "42P01") {
        setTableReady(false);
        throw new Error("Support system is being set up. Please try again shortly.");
      }
      throw new Error(error.message ?? "Failed to submit ticket");
    }
    await fetchTickets();
  }

  return { tickets, loading, tableReady, createTicket, refresh: fetchTickets };
}
