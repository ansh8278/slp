import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { login } from "@/app/admin/actions";
import { ActionForm, SubmitButton, Label, inputCls } from "@/components/admin/ui";
import { Tilt3D } from "@/components/Tilt3D";
import { DoodleShield, DoodleLock, DoodleMic, DoodleKey, DoodleSparkles, DoodleRadar } from "@/components/DoodleIcons";

export const metadata: Metadata = { title: "Admin Portal Sign In — Security Leader Podcast", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <div className="relative flex min-h-svh items-center justify-center px-4 py-12 sm:py-20 bg-gradient-to-b from-ink via-ink-2 to-ink overflow-hidden text-bone">
      
      {/* Background Neon Ambient Glow Circles */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/4 h-[550px] w-[550px] rounded-full bg-radial from-signal/25 via-signal-bright/15 to-transparent blur-3xl opacity-75 animate-pulse-3d"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 right-1/4 h-[450px] w-[450px] rounded-full bg-radial from-navy/40 via-signal/15 to-transparent blur-3xl opacity-60"
      />

      {/* Main Split-Screen 3D Glass Container */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
          
          {/* Left Column: Executive 3D Showcase & Security Telemetry */}
          <div className="hidden lg:flex flex-col gap-8 p-6">
            
            {/* Top Brand Identity */}
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-steel/25 bg-ink-3 p-2.5 shadow-xl">
                <Image src="/brand/logo.png" alt="Logo" fill sizes="44px" className="object-contain p-1" priority />
              </div>
              <div>
                <span className="block font-mono text-[10px] tracking-[0.3em] text-steel-dim uppercase">
                  BUSINESS SECURITY ALLIANCE
                </span>
                <h2 className="display text-2xl text-bone">
                  Security Leader <span className="text-signal-bright font-medium">Podcast</span>
                </h2>
              </div>
            </div>

            {/* 3D Floating Artwork Medallion */}
            <Tilt3D maxTilt={14} scale={1.03}>
              <div className="preserve-3d relative flex items-center justify-center h-[340px] rounded-3xl border border-steel/20 bg-ink-2/60 p-6 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.65)]">
                
                {/* Radial Glow */}
                <div
                  aria-hidden
                  className="absolute inset-4 rounded-full bg-gradient-to-tr from-signal/25 via-signal-bright/20 to-transparent blur-2xl opacity-70 pointer-events-none"
                />

                {/* Podcast Artwork Logo */}
                <div className="relative z-10 h-60 w-60 drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-transform duration-700 hover:scale-105">
                  <Image
                    src="/brand/logo.png"
                    alt="Security Leader Podcast Medallion"
                    fill
                    sizes="240px"
                    priority
                    className="object-contain"
                  />
                </div>

                {/* Floating Telemetry Badge 1 */}
                <div className="absolute top-4 left-4 z-20 animate-float-3d">
                  <div className="flex items-center gap-2 rounded-full border border-steel/25 bg-ink-2/95 px-3.5 py-1.5 shadow-xl backdrop-blur-md font-mono text-[10.5px] text-bone">
                    <DoodleShield className="h-4 w-4" stroke="#82c91e" />
                    <span>256-Bit SSL Auth</span>
                  </div>
                </div>

                {/* Floating Telemetry Badge 2 */}
                <div className="absolute bottom-4 right-4 z-20 animate-float-3d" style={{ animationDelay: "-3s" }}>
                  <div className="flex items-center gap-2 rounded-full border border-steel/20 bg-ink-3/95 px-4 py-2 shadow-xl backdrop-blur-md font-mono text-[11px] text-signal-bright font-bold">
                    <DoodleMic className="h-4 w-4" stroke="#3e9be6" />
                    <span>CISO Executive Portal</span>
                  </div>
                </div>

              </div>
            </Tilt3D>

            {/* Mission Statement */}
            <div className="flex flex-col gap-2 border-l-2 border-signal/60 pl-4">
              <p className="font-mono text-xs text-steel-dim leading-relaxed">
                &ldquo;Bringing you unfiltered industry perspectives from the most influential thought leaders shaping the future of security.&rdquo;
              </p>
              <span className="font-mono text-[10px] tracking-[0.2em] text-signal-bright uppercase">
                Official Admin Portal
              </span>
            </div>

          </div>

          {/* Right Column: 3D Interactive Login Card */}
          <Tilt3D maxTilt={8} scale={1.02} className="w-full">
            <div className="preserve-3d relative flex flex-col gap-6 rounded-3xl border border-steel/25 bg-ink-2/95 p-7 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
              
              {/* Top Security Status Pill */}
              <div className="flex items-center justify-between translate-z-20">
                <div className="flex items-center gap-2 rounded-full border border-signal/30 bg-signal/15 px-3.5 py-1 text-[11px] font-mono text-signal-bright font-bold">
                  <span className="h-2 w-2 rounded-full bg-signal-bright animate-pulse" />
                  <span>RESTRICTED ACCESS</span>
                </div>
                <div className="flex items-center gap-1.5 text-steel-dim font-mono text-xs">
                  <DoodleLock className="h-4.5 w-4.5" stroke="#3e9be6" />
                </div>
              </div>

              {/* Mobile-Only Header */}
              <div className="flex lg:hidden items-center gap-3 pt-1 translate-z-20">
                <Image src="/brand/logo.png" alt="Logo" width={40} height={40} className="h-10 w-10" />
                <div>
                  <span className="block font-mono text-[9px] tracking-[0.25em] text-steel-dim uppercase">
                    SECURITY LEADER PODCAST
                  </span>
                  <span className="font-display text-lg text-bone">Admin Sign In</span>
                </div>
              </div>

              {/* Card Title */}
              <div className="translate-z-30 pt-1">
                <h1 className="display text-3xl sm:text-4xl text-bone flex flex-wrap items-center gap-3">
                  <span className="funky-text text-signal-bright font-normal">Admin</span>
                  <span>Sign In</span>
                </h1>
                <p className="mt-2 text-sm text-steel-dim leading-relaxed">
                  Enter your executive admin credentials to manage episodes, site content, and inbox.
                </p>
              </div>

              {/* Form Controls */}
              <ActionForm action={login} className="flex flex-col gap-5 pt-2 translate-z-20">
                
                {/* Email Input */}
                <label className="flex flex-col gap-2">
                  <Label>Email Address</Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 z-10 text-lg pointer-events-none">
                      ✉️
                    </span>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Enter admin email"
                      autoComplete="username"
                      className={`${inputCls} pl-12`}
                    />
                  </div>
                </label>

                {/* Password Input */}
                <label className="flex flex-col gap-2">
                  <Label>Password</Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 z-10 text-lg pointer-events-none">
                      🔑
                    </span>
                    <input
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className={`${inputCls} pl-12`}
                    />
                  </div>
                </label>

                {/* Sign In Submit Button with Loader */}
                <div className="mt-3">
                  <SubmitButton variant="primary" loadingText="Signing in to Portal...">
                    Sign in to Dashboard →
                  </SubmitButton>
                </div>
              </ActionForm>

              {/* Footer Credentials Reminder */}
              <div className="flex flex-col gap-2 pt-2 border-t border-steel/15 font-mono text-[11px] text-steel-dim translate-z-10">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <DoodleShield className="h-4 w-4" stroke="#82c91e" />
                    <span>Protected Admin Area</span>
                  </span>
                  <Link href="/" className="text-signal-bright hover:underline">
                    Public Site ↗
                  </Link>
                </div>
              </div>

            </div>
          </Tilt3D>

        </div>
      </div>

    </div>
  );
}
