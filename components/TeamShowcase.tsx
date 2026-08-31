"use client";

import Image from "next/image";
import { Tilt3D } from "./Tilt3D";
import { DoodleShield, DoodleMic, DoodleSoundwave } from "./DoodleIcons";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  tag: string;
  objectPosition?: string;
  zoom?: number;
};

export function TeamShowcase({
  members,
  title = "Meet the Voices Behind the Podcast",
  subtitle = "LEADERSHIP & HOSTS",
}: {
  members: TeamMember[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden px-[clamp(18px,4vw,56px)] py-[clamp(50px,8vh,100px)] rule">
      
      {/* Background Ambient Glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, rgba(31,121,192,0.15), transparent 75%)",
        }}
      />

      <div className="shell relative px-0 flex flex-col gap-10 z-10">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <span className="block h-px w-10 bg-signal" />
            <span className="kicker text-signal-bright tracking-[0.28em]">{subtitle}</span>
          </div>
          <h2 className="display text-[clamp(26px,3.8vw,52px)] text-bone">{title}</h2>
          <p className="max-w-[54ch] text-[14.5px] leading-relaxed text-steel-dim">
            The security visionaries, executive hosts, and producers bringing you unfiltered industry perspectives every episode.
          </p>
        </div>

        {/* Compact Cyber-Holographic Team Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <Tilt3D key={member.id} maxTilt={8} scale={1.02} className="w-full">
              <div className="group preserve-3d relative flex flex-col justify-between overflow-hidden rounded-2xl border border-steel/18 bg-ink-2/90 p-4.5 backdrop-blur-xl transition-all duration-500 hover:border-signal/60 hover:shadow-[0_20px_50px_rgba(31,121,192,0.25)] shadow-lg">
                
                {/* Neon Holographic Border Glow */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(62,155,230,0.18) 0%, rgba(130,201,30,0.08) 50%, transparent 100%)",
                  }}
                />

                <div>
                  {/* Compact Header Image (Sleek 16:11 Aspect Ratio) */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-ink-3 border border-steel/12 shadow-inner">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      style={{
                        objectFit: "cover",
                        objectPosition: member.objectPosition || "50% 15%",
                        transform: `scale(${(member.zoom || 100) / 100})`,
                      }}
                      className="transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/30 to-transparent" />

                    {/* Live Badge Tag */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full border border-steel/20 bg-ink/85 px-3 py-1 text-[10px] font-mono tracking-[0.14em] text-bone uppercase backdrop-blur-md shadow-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal-bright animate-pulse" />
                      <span>{member.tag}</span>
                    </div>

                    {/* Member Name Overlay on Image Bottom */}
                    <div className="absolute bottom-2.5 left-3 right-3 translate-z-10">
                      <h3 className="display text-xl text-bone group-hover:text-signal-bright transition-colors drop-shadow-md">
                        {member.name}
                      </h3>
                      <p className="font-mono text-[11px] text-signal-bright font-medium tracking-wide">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Bio Description (Compact & Clean) */}
                  <div className="mt-3.5 px-1 translate-z-10">
                    <p className="line-clamp-3 text-[13px] leading-[1.65] text-steel-dim">
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="mt-4 flex items-center justify-between border-t border-steel/12 pt-3 px-1 translate-z-20">
                  <span className="flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.2em] text-steel-dim uppercase">
                    <DoodleSoundwave className="h-3 w-3 text-signal-bright" stroke="#82c91e" />
                    SLP LEADERSHIP
                  </span>
                  <DoodleShield className="h-3.5 w-3.5 text-signal opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>

              </div>
            </Tilt3D>
          ))}
        </div>

      </div>
    </section>
  );
}
