"use client";

import { useActionState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/app/admin/actions";

export const inputCls =
  "w-full rounded-2xl border-2 border-steel/40 bg-ink-2/90 px-4 py-3.5 text-[15px] font-medium text-bone outline-none transition-all duration-300 focus:border-signal-bright focus:bg-ink focus:ring-4 focus:ring-signal/30 placeholder:text-steel-dim/60 shadow-lg";

export function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="flex items-baseline justify-between gap-2">
      <span className="kicker text-steel/90 font-bold">{children}</span>
      {hint && <span className="font-mono text-[10px] normal-case text-steel-dim/70">{hint}</span>}
    </span>
  );
}

export function SubmitButton({
  children = "Save Changes",
  loadingText = "Processing...",
  variant = "primary",
}: {
  children?: React.ReactNode;
  loadingText?: string;
  variant?: "primary" | "ghost" | "danger";
}) {
  const { pending } = useFormStatus();
  const base =
    "w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full px-6 py-3 font-mono text-[11px] tracking-[0.16em] uppercase transition-all duration-300 active:scale-95 disabled:cursor-wait disabled:opacity-75 shadow-md";
  const styles = {
    primary: "bg-bone text-ink font-bold hover:bg-signal hover:text-bone hover:scale-105 hover:shadow-signal/30",
    ghost: "border border-steel/25 text-steel hover:border-steel hover:text-bone hover:scale-105",
    danger: "border border-[#c2544e]/50 bg-[#c2544e]/10 text-[#e08a84] hover:bg-[#c2544e] hover:text-bone hover:scale-105",
  }[variant];

  return (
    <button type="submit" disabled={pending} className={`${base} ${styles}`}>
      {pending ? (
        <>
          <span
            className="block h-4 w-4 rounded-full border-2 border-current/25 border-t-current"
            style={{ animation: "slp-spin .6s linear infinite" }}
          />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function SignOutButton({ action }: { action?: () => Promise<void> }) {
  const { pending } = useFormStatus();
  const [isPending, startTransition] = useTransition();
  const loading = pending || isPending;

  return (
    <button
      type={action ? "button" : "submit"}
      disabled={loading}
      onClick={
        action
          ? () => {
              startTransition(async () => {
                await action();
              });
            }
          : undefined
      }
      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#c2544e]/40 bg-[#c2544e]/10 px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-[#e08a84] uppercase transition-all duration-300 hover:bg-[#c2544e] hover:text-white hover:scale-105 disabled:cursor-wait disabled:opacity-70"
    >
      {loading ? (
        <>
          <span
            className="block h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white"
            style={{ animation: "slp-spin .6s linear infinite" }}
          />
          <span>Signing out...</span>
        </>
      ) : (
        <span>Sign out</span>
      )}
    </button>
  );
}

/** Wraps a server action with useActionState so errors/success render inline. */
export function ActionForm({
  action,
  children,
  className = "",
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});
  return (
    <form action={formAction} className={className}>
      {children}
      {state.error && (
        <p
          role="alert"
          className="mt-4 rounded-2xl border border-[#c2544e]/40 bg-[#c2544e]/15 px-4 py-3 text-[13.5px] text-[#e08a84] backdrop-blur-md shadow-md"
        >
          ⚠️ {state.error}
        </p>
      )}
      {state.ok && (
        <p
          role="status"
          className="mt-4 rounded-2xl border border-signal/40 bg-signal/15 px-4 py-3 text-[13.5px] text-signal-bright backdrop-blur-md shadow-md"
        >
          ✓ {state.ok}
        </p>
      )}
    </form>
  );
}

export function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-steel/15 bg-ink-2/80 p-[clamp(20px,3vw,34px)] shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-steel/30">
      <h2 className="display text-[clamp(20px,2.2vw,28px)] text-bone">{title}</h2>
      {description && <p className="mt-1.5 max-w-[62ch] text-[13.5px] leading-relaxed text-steel-dim">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
