"use server";

import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";

export type ContactState = { status: "idle" | "success" | "error"; message?: string; fieldErrors?: Record<string, string> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // honeypot — bots fill it, humans never see it
  if ((formData.get("website") as string)?.trim()) return { status: "success" };

  const get = (k: string) => (formData.get(k) as string | null)?.trim() ?? "";
  const name = get("name");
  const email = get("email");
  const organization = get("organization");
  const subject = get("subject");
  const message = get("message");

  // Rate limiting per email/IP
  const rateKey = `contact:${email || "anonymous"}`;
  const rate = checkRateLimit(rateKey, 5, 10 * 60 * 1000, 10 * 60 * 1000);
  if (!rate.allowed) {
    return { status: "error", message: "Too many messages sent. Please wait a few minutes before trying again." };
  }

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Please enter your name.";
  if (!EMAIL.test(email)) fieldErrors.email = "Please enter a valid email address.";
  if (subject.length < 2) fieldErrors.subject = "Please choose or enter a subject.";
  if (message.length < 10) fieldErrors.message = "Please tell us a little more (10+ characters).";
  if (name.length > 120 || email.length > 200 || organization.length > 160 || subject.length > 160 || message.length > 5000) {
    fieldErrors.message = "That's longer than we can accept.";
  }
  if (Object.keys(fieldErrors).length) return { status: "error", message: "Please check the highlighted fields.", fieldErrors };

  try {
    await prisma.contactMessage.create({
      data: { name, email, organization: organization || null, subject, message },
    });
    return { status: "success" };
  } catch {
    return { status: "error", message: "Something went wrong sending your message. Please try again." };
  }
}
