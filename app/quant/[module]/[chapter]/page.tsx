import { notFound } from "next/navigation";
import { getQuantChapter, quantAllChapterRoutes } from "@/lib/quant";
import { getQuantChapterComponent } from "@/components/quant/chapters/registry";

export function generateStaticParams() {
  return quantAllChapterRoutes;
}

export function generateMetadata({
  params,
}: {
  params: { module: string; chapter: string };
}) {
  const ch = getQuantChapter(params.module, params.chapter);
  return { title: ch?.title ?? "Chapter" };
}

export default function QuantChapterPage({
  params,
}: {
  params: { module: string; chapter: string };
}) {
  const Cmp = getQuantChapterComponent(params.module, params.chapter);
  if (!Cmp) notFound();
  return <Cmp />;
}
