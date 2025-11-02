import type { ResourceLanguage } from "i18next";
import { initI18next } from "@/app/i18n/server";
import ClientComponent from "@/components/ClientComponent";
import I18nProvider from "@/components/I18nProvider";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import LocalizedLink from "@/components/LocalizedLink";
import ServerComponent from "@/components/ServerComponent";
import type { Locale } from "@/i18n.config";
import { defaultLocale } from "@/i18n.config";
import type { Namespace } from "@/i18n.namespaces";

/**
 * Server component page that handles i18n initialization
 * Pre-loads translations on the server and passes them to client components
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  // Define which translation namespaces this page needs
  // Using 'as const' for type safety and better autocomplete
  const namespaces = [
    "common",
    "about",
  ] as const satisfies readonly Namespace[];

  const { locale } = await params;
  
  // Initialize i18next on the server with required namespaces
  // This loads translation JSON files server-side
  const i18n = await initI18next(locale, namespaces);

  // Resolve the actual language from the initialized instance (handles undefined params)
  const resolvedLocale = i18n.language ?? (defaultLocale as Locale);

  // Get a fixed translation function for the "about" namespace
  // getFixedT locks the namespace, so t("title") instead of t("about:title")
  const tAbout = i18n.getFixedT(resolvedLocale, "about");

  // Extract translation bundles from the i18n instance
  // This data is passed to I18nProvider to hydrate client-side i18n
  // Prevents FOUC (Flash of Untranslated Content) and avoids duplicate fetching
  const resources = Object.fromEntries(
    namespaces.map((ns) => [
      ns,
      i18n.getResourceBundle(resolvedLocale, ns) as ResourceLanguage,
    ])
  ) as Record<Namespace, ResourceLanguage>;

  return (
    <I18nProvider
      locale={resolvedLocale}
      namespaces={namespaces}
      resources={resources}
    >
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <div className="w-full flex justify-between items-start">
            <LocalizedLink
              href="/"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            >
              ← Back to Home
            </LocalizedLink>
            <LocaleSwitcher />
          </div>
          <div className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left w-full">
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
              {tAbout("title")}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {tAbout("description")}
            </p>

            <div className="w-full border-t border-zinc-200 dark:border-zinc-800 pt-8 mt-8">
              <h2 className="text-2xl font-semibold mb-6 text-black dark:text-zinc-50">
                Client Component Example
              </h2>
              <ClientComponent />
            </div>

            <div className="w-full border-t border-zinc-200 dark:border-zinc-800 pt-8 mt-8">
              <h2 className="text-2xl font-semibold mb-6 text-black dark:text-zinc-50">
                Server Component Example
              </h2>
              <ServerComponent t={tAbout} locale={resolvedLocale} count={0} />
            </div>
          </div>
          <div className="w-full pt-8" />
        </main>
      </div>
    </I18nProvider>
  );
}
