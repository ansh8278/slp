import { requireAdminPage } from "@/lib/auth";
import { ScriptsPanel } from "@/components/admin/ScriptsPanel";

export const metadata = { title: "Code Injector — Security Leader Podcast Admin" };

export default async function AdminScriptsPage() {
  await requireAdminPage();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <ScriptsPanel />
    </div>
  );
}
