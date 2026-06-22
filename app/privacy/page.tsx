import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  title: `Privacy — ${SITE.name}`,
  description: "Privacy policy for World Cup 2026 Calendar.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/"
        className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
      >
        ← Back to calendar
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Privacy policy
      </h1>
      <p className="mt-2 text-sm text-zinc-500">Last updated: June 2026</p>

      <div className="prose prose-zinc mt-8 space-y-6 text-sm dark:prose-invert">
        <section>
          <h2 className="text-lg font-semibold">Overview</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {SITE.name} ({SITE.productionUrl}) is a free tool to build a
            personal FIFA World Cup 2026 match calendar. We do not require an
            account and do not store your team or match selections on our
            servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">What we collect</h2>
          <ul className="list-disc space-y-2 pl-5 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Analytics</strong> — Google Analytics may collect
              anonymised usage data (pages visited, device type, country). See{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-emerald-600 underline dark:text-emerald-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s privacy policy
              </a>
              .
            </li>
            <li>
              <strong>Advertising</strong> — If enabled, Google AdSense may use
              cookies to serve ads. See{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                className="text-emerald-600 underline dark:text-emerald-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google advertising policies
              </a>
              .
            </li>
            <li>
              <strong>Local storage</strong> — Your timezone preference is saved
              in your browser only.
            </li>
            <li>
              <strong>Donations</strong> — Payments are handled by Stripe. We do
              not receive or store card details.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Calendar feeds</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            When you export a calendar, match IDs are sent in the URL to
            generate an ICS file. This is required for the service to work. We
            do not log which specific matches you select.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Third parties</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            We use Vercel (hosting), Google Analytics, optional Google AdSense,
            and Stripe (donations). Each has its own privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Questions? Open an issue on the project GitHub repository or contact
            the site owner.
          </p>
        </section>

        <p className="text-xs text-zinc-400">
          Not affiliated with FIFA. Match schedules are for informational use
          only.
        </p>
      </div>
    </main>
  );
}
