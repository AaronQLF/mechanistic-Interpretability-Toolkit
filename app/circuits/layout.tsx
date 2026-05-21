import { ChapterNav } from "@/components/ui/ChapterNav";
import { circuitsChapters } from "@/lib/topics";

export default function CircuitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-10">
      <aside className="hidden lg:block">
        <ChapterNav
          moduleSlug="circuits"
          moduleTitle="Mech-interp Circuits"
          chapters={circuitsChapters}
        />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
