import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteLink } from "@/actions/links";
import { CopyButton } from "@/components/copy-button";
import {
  formatDisplayUrl,
  getDisplayUrl,
  getLinkByShortCode,
} from "@/lib/link-service";

type PageParams = {
  params: { code: string };
};

export async function generateMetadata({ params }: PageParams) {
  const { code } = params;
  return {
    title: `Stats for ${code} | TinyLink`,
  };
}

export default async function CodeStatsPage({ params }: PageParams) {
  const { code } = params;
  const link = await getLinkByShortCode(code);

  if (!link) {
    notFound();
  }

  const shortUrl = getDisplayUrl(link.shortCode);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-0">
      <Link
        href="/"
        className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
      >
        ← Back to dashboard
      </Link>

      <section className="rounded-3xl bg-white p-8 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">
          TinyLink stats
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          /{link.shortCode}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Redirects to{" "}
          <span className="font-semibold text-slate-800">
            {formatDisplayUrl(link.originalUrl)}
          </span>
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-brand/40 hover:bg-brand/90"
          >
            Visit short link
          </a>
          <CopyButton value={shortUrl} />
          <form action={deleteLink.bind(null, link.shortCode)}>
            <button
              type="submit"
              className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Delete link
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total clicks" value={link.clickCount.toString()} />
        <StatCard
          label="Last clicked"
          value={link.lastClicked ? formatFullDate(link.lastClicked) : "—"}
        />
        <StatCard label="Created at" value={formatFullDate(link.createdAt)} />
        <StatCard label="Destination" value={link.originalUrl} truncate />
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  truncate,
}: {
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p
        className={`mt-2 text-lg font-semibold text-slate-900 ${
          truncate ? "truncate" : ""
        }`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

