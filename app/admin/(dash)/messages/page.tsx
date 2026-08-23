import { prisma } from "@/lib/db";
import { deleteMessage, markRead } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="display text-[clamp(24px,3vw,38px)] text-bone">Messages</h1>
        <p className="mt-1 text-[13px] text-steel-dim">
          {messages.length} received · {messages.filter((m) => !m.read).length} unread
        </p>
      </div>

      {messages.length === 0 ? (
        <p className="rounded-md border border-dashed border-steel/18 px-5 py-12 text-center text-[13.5px] text-steel-dim">
          No messages yet.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {messages.map((m) => (
            <li
              key={m.id}
              className="rounded-md border bg-ink-2/50 p-5"
              style={{ borderColor: m.read ? "color-mix(in srgb, var(--color-steel) 12%, transparent)" : "color-mix(in srgb, var(--color-signal) 42%, transparent)" }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display text-[17px] text-bone">{m.subject}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] tracking-[0.12em] text-steel-dim uppercase">
                    <span>{m.name}</span>
                    <span className="opacity-40">·</span>
                    <a href={`mailto:${m.email}`} className="normal-case transition-colors hover:text-bone">{m.email}</a>
                    {m.organization && <><span className="opacity-40">·</span><span>{m.organization}</span></>}
                    <span className="opacity-40">·</span>
                    <span>{m.createdAt.toLocaleString()}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={markRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="cursor-pointer rounded-full border border-steel/22 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-steel uppercase transition-colors hover:border-steel hover:text-bone">
                      {m.read ? "Unread" : "Mark read"}
                    </button>
                  </form>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="cursor-pointer rounded-full border border-[#c2544e]/40 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-[#e08a84] uppercase transition-colors hover:bg-[#c2544e] hover:text-bone">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-[1.75] whitespace-pre-wrap text-steel">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
