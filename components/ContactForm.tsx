"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { submitContact, type ContactState } from "@/app/(site)/contact/actions";

const FIELD =
  "w-full rounded-xl border bg-ink-2/70 px-4 py-3.5 text-[15px] text-bone outline-none transition-colors duration-300 placeholder:text-steel-dim/55 focus:border-signal";

function Field({
  label, name, type = "text", required, error, ...rest
}: { label: string; name: string; type?: string; required?: boolean; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="kicker">{label}{required && <span className="text-signal-bright"> *</span>}</span>
      <input
        name={name}
        type={type}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={FIELD}
        style={{ borderColor: error ? "#c2544e" : "color-mix(in srgb, var(--color-steel) 16%, transparent)" }}
        {...rest}
      />
      {error && <span id={`${name}-error`} className="text-[12.5px] text-[#e08a84]">{error}</span>}
    </label>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex cursor-pointer items-center gap-3 self-start rounded-full bg-bone px-7 py-3.5 font-mono text-[11px] tracking-[0.18em] text-ink uppercase transition-colors duration-300 hover:bg-signal hover:text-bone disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? (
        <>
          <span className="block h-3.5 w-3.5 rounded-full border-2 border-ink/25 border-t-ink" style={{ animation: "slp-spin .7s linear infinite" }} />
          Sending
        </>
      ) : (
        <>
          Send message
          <span className="transition-transform duration-400 group-hover:translate-x-1">→</span>
        </>
      )}
    </button>
  );
}

export function ContactForm({ subjects }: { subjects: string[] }) {
  const [state, action] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const reduce = useReducedMotion();
  const err = state.fieldErrors ?? {};

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === "success" ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: reduce ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          className="rounded-3xl border border-signal/40 bg-ink-2/70 p-[clamp(28px,4vw,52px)]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-signal">
            <svg width="17" height="13" viewBox="0 0 17 13" aria-hidden><path d="M1 6.5L6 11.5L16 1.5" stroke="var(--color-bone)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <h3 className="display mt-6 text-[clamp(22px,2.6vw,34px)] text-bone">Message received.</h3>
          <p className="mt-3 max-w-[44ch] text-[14.5px] leading-relaxed text-steel-dim">
            Thanks for reaching out — we&rsquo;ll get back to you at the address you provided.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          action={action}
          noValidate
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-5"
        >
          {/* honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" name="name" required autoComplete="name" error={err.name} />
            <Field label="Email" name="email" type="email" required autoComplete="email" error={err.email} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Organization" name="organization" autoComplete="organization" error={err.organization} />
            <label className="flex flex-col gap-2">
              <span className="kicker">Subject<span className="text-signal-bright"> *</span></span>
              <input
                name="subject"
                required
                list="slp-subjects"
                placeholder="Choose or type your own"
                aria-invalid={Boolean(err.subject)}
                className={FIELD}
                style={{ borderColor: err.subject ? "#c2544e" : "color-mix(in srgb, var(--color-steel) 16%, transparent)" }}
              />
              <datalist id="slp-subjects">
                {subjects.map((s) => <option key={s} value={s} />)}
              </datalist>
              {err.subject && <span className="text-[12.5px] text-[#e08a84]">{err.subject}</span>}
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="kicker">Message<span className="text-signal-bright"> *</span></span>
            <textarea
              name="message"
              required
              rows={6}
              aria-invalid={Boolean(err.message)}
              className={`${FIELD} resize-y`}
              style={{ borderColor: err.message ? "#c2544e" : "color-mix(in srgb, var(--color-steel) 16%, transparent)" }}
            />
            {err.message && <span className="text-[12.5px] text-[#e08a84]">{err.message}</span>}
          </label>

          {state.status === "error" && state.message && (
            <p role="alert" className="text-[13px] text-[#e08a84]">{state.message}</p>
          )}

          <Submit />
        </motion.form>
      )}
    </AnimatePresence>
  );
}
