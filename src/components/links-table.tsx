import { Link } from "@prisma/client";
import { deleteLink } from "@/actions/links";
import { CopyButton } from "./copy-button";

type Props = {
  links: Link[];
  baseUrl: string;
};

export function LinksTable({ links, baseUrl }: Props) {
  if (links.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        You have not created any links yet. Shorten your first URL to see it
        appear here with click stats.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-6 py-4">Short URL</th>
            <th className="px-6 py-4">Destination</th>
            <th className="px-6 py-4 text-center">Clicks</th>
            <th className="px-6 py-4">Last clicked</th>
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
          {links.map((link) => {
            const shortUrl = `${baseUrl.replace(/\/$/, "")}/${link.shortCode}`;
            return (
              <tr key={link.id} className="hover:bg-slate-50/60">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <a
                      className="font-semibold text-slate-900 hover:text-brand"
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {shortUrl}
                    </a>
                    <CopyButton value={shortUrl} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="line-clamp-2 text-sm text-slate-500">
                    {link.originalUrl}
                  </p>
                </td>
                <td className="px-6 py-4 text-center text-lg font-semibold text-slate-900">
                  {link.clickCount}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {link.lastClicked
                    ? formatRelativeTime(link.lastClicked)
                    : "—"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {formatDate(link.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/code/${link.shortCode}`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Stats
                    </a>
                    <form action={deleteLink.bind(null, link.shortCode)}>
                      <button
                        type="submit"
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-red-100 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeTime(value: Date) {
  const now = Date.now();
  const diff = now - value.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "moments ago";
  if (diff < hour) {
    const mins = Math.round(diff / minute);
    return `${mins}m ago`;
  }
  if (diff < day) {
    const hrs = Math.round(diff / hour);
    return `${hrs}h ago`;
  }
  const days = Math.round(diff / day);
  return `${days}d ago`;
}

