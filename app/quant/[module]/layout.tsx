import { notFound } from "next/navigation";
import { ChapterNav } from "@/components/ui/ChapterNav";
import { getQuantModule, quantModulePath } from "@/lib/quant";

export default function QuantModuleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { module: string };
}) {
  const mod = getQuantModule(params.module);
  if (!mod) notFound();
  const chapters = mod.chapters ?? [];
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-10">
      <aside className="hidden lg:block">
        <ChapterNav
          moduleSlug={quantModulePath(mod.slug)}
          moduleTitle={mod.title}
          chapters={chapters}
        />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
