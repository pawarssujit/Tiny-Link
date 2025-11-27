"use client";

import { useActionState, useMemo } from "react";
import { useFormStatus } from "react-dom";

import { createLink, LinkActionState } from "@/actions/links";

const initialState: LinkActionState = {};

type Props = {
  baseUrl: string;
};

export function CreateLinkForm({ baseUrl }: Props) {
  const [state, formAction] = useActionState(createLink, initialState);
  const shortUrl = useMemo(() => {
    if (!state.shortUrl) return null;
    return `${baseUrl.replace(/\/$/, "")}/${state.shortUrl}`;
  }, [baseUrl, state.shortUrl]);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          Create short link
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Paste your long URL and TinyLink will handle the rest
        </h2>
        <p className="text-sm text-slate-500">
          Inspired by platforms like Bitly, TinyLink gives you instant
          redirects, click tracking, and easy management.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Destination URL
          <input
            type="url"
            name="originalUrl"
            required
            placeholder="https://example.com/your/long/link"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-brand/60"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Custom back-half (optional)
          <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 text-sm shadow-inner">
            <span className="px-3 text-slate-500">
              {baseUrl.replace(/https?:\/\//, "")}/
            </span>
            <input
              type="text"
              name="customCode"
              placeholder="landing"
              className="h-11 flex-1 bg-transparent pr-3 text-base text-slate-900 outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Letters or numbers only, 6-8 characters.
          </p>
        </label>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {state.error}
          </p>
        )}

        {state.success && shortUrl && (
          <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {state.success}{" "}
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline"
            >
              {shortUrl}
            </a>
          </div>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3 font-semibold text-white shadow-lg shadow-brand/40 transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Generating..." : "Generate short link"}
    </button>
  );
}

