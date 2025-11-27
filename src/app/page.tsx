import Link from "next/link";

import { CreateLinkForm } from "@/components/create-link-form";
import { LinksTable } from "@/components/links-table";
import { getLinkSummary, listLinks } from "@/lib/link-service";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function Home({ searchParams }: PageProps) {
  const queryParam = searchParams?.q;
  const query =
    typeof queryParam === "string" && queryParam.trim().length > 0
      ? queryParam.trim()
      : undefined;

  const [links, summary] = await Promise.all([
    listLinks(query),
    getLinkSummary(),
  ]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-0">
      <header className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-card">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-foreground/80">
            TinyLink
          </p>
          <h1 className="text-4xl font-semibold leading-tight">
            Shorten, track, and manage links with a Bitly-style workflow.
          </h1>
          <p className="text-base text-slate-200">
            Create branded short links, monitor click-through performance, and
            keep every URL organized — perfect for demos, marketing teams, and
            take-home assignments.
          </p>
        </div>
        <dl className="grid gap-6 sm:grid-cols-3">
          <Stat label="Links created" value={summary.totalLinks.toString()} />
          <Stat
            label="Total clicks"
            value={summary.totalClicks.toString()}
          />
          <Stat
            label="Live short domain"
            value={baseUrl.replace(/https?:\/\//, "")}
          />
        </dl>
      </header>

      <CreateLinkForm baseUrl={baseUrl} />

      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h3 className="text-xl font-semibold text-slate-900">
            Active links
          </h3>
          <form className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-end" method="get">
            <label className="flex-1 text-sm font-medium text-slate-600">
              Search by code or URL
              <input
                type="text"
                name="q"
                defaultValue={query ?? ""}
                placeholder="docs, landing, https://..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/60"
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Filter
            </button>
            {query && (
              <Link
                href="/"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear
              </Link>
            )}
          </form>
        </div>
        {query && (
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{links.length}</span>{" "}
            result{links.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;.
          </p>
        )}
        <LinksTable links={links} baseUrl={baseUrl} />
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm uppercase tracking-widest text-slate-300">
        {label}
      </dt>
      <dd className="text-3xl font-semibold">{value}</dd>
    </div>
  );
}
