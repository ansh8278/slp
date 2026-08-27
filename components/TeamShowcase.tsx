"use client";

import Image from "next/image";
import { Tilt3D } from "./Tilt3D";
import { DoodleShield, DoodleMic, DoodleSparkles } from "./DoodleIcons";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  tag: string;
};

export function TeamShowcase({ members, title = "Meet the Voices Behind the Podcast", subtitle = "LEADERSHIP & HOSTS" }: { members: TeamMember[]; title?: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden px-[clamp(18px,4vw,56px)] py-[clamp(60px,10vh,120px)] rule">
      <div className="shell px-0 flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="block h-px w-10 bg-signal" />
            <span className="kicker text-signal-bright">{subtitle}</span>
          </div>
          <h2 className="display text-[clamp(28px,4vw,56px)] text-bone">{title}</h2>
          <p className="max-w-[54ch] text-[15px] leading-relaxed text-steel-dim">
            The security visionaries, executive hosts, and producers bringing you unfiltered industry perspectives every episode.
          </p>
        </div>

        {/* Member Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Tilt3D key={member.id} maxTilt={10} scale={1.03} className="h-full w-full">
              <div className="group preserve-3d relative flex flex-col justify-between overflow-hidden rounded-3xl border border-steel/15 bg-ink-2/80 p-6 backdrop-blur-md transition-all duration-500 hover:border-signal/50 hover:shadow-2xl shadow-xl h-full">
                
                {/* Radial Glow Highlight */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none"
                  style={{ background: "radial-gradient(120% 90% at 50% 0%, rgba(31,121,192,0.25), transparent 70%)" }}
                />

                <div>
                  {/* Photo Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink-3 mb-5 border border-steel/10 shadow-lg group-hover:shadow-signal/20 transition-all duration-500">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />

                    {/* Tag Badge */}
                    <span className="absolute top-3 right-3 rounded-full border border-steel/20 bg-ink/80 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-signal-bright uppercase backdrop-blur-md">
                      {member.tag}
                    </span>
                  </div>

                  {/* Member Info */}
                  <div className="flex flex-col gap-1.5 translate-z-10">
                    <h3 className="display text-2xl text-bone group-hover:text-signal-bright transition-colors">{member.name}</h3>
                    <p className="font-mono text-xs text-signal-bright font-medium">{member.role}</p>
                    <p className="mt-3 text-[13.5px] leading-relaxed text-steel-dim">{member.bio}</p>
                  </div>
                </div>

                {/* Footer Icon Badge */}
                <div className="mt-6 flex items-center justify-between border-t border-steel/10 pt-4 translate-z-20">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-steel-dim uppercase">Security Leader Podcast</span>
                  <DoodleShield className="h-4 w-4 text-signal-bright opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Tilt3D>
          ))}
        </div>
      </div>
    </section>
  );
}
