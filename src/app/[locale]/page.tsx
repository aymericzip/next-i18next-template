import type { ResourceLanguage } from "i18next";
import { initI18next } from "@/app/i18n/server";
import I18nProvider from "@/components/I18nProvider";
import LocalizedLink from "@/components/LocalizedLink";
import type { Locale } from "@/i18n.config";
import type { Namespace } from "@/i18n.namespaces";

/**
 * Home page - server component that handles i18n initialization
 * Pre-loads translations on the server and passes them to client components
 */
export default async function HomePage({
	params: { locale },
}: {
	params: { locale: Locale };
}) {
	// Define which translation namespaces this page needs
	const namespaces = ["common"] as const satisfies readonly Namespace[];

	// Initialize i18next on the server with required namespaces
	const i18n = await initI18next(locale, namespaces);

	// Get a fixed translation function for the "common" namespace
	const tCommon = i18n.getFixedT(locale, "common");

	// Extract translation bundles from the i18n instance
	const resources = Object.fromEntries(
		namespaces.map((ns) => [
			ns,
			i18n.getResourceBundle(locale, ns) as ResourceLanguage,
		]),
	) as Record<Namespace, ResourceLanguage>;

	return (
		<I18nProvider locale={locale} namespaces={namespaces} resources={resources}>
			<main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white">
				<div className="text-center max-w-3xl px-8">
					<h1 className="text-6xl font-bold mb-4">{tCommon("welcome")}</h1>
					<p className="text-2xl mb-8 opacity-90">{tCommon("greeting")}</p>
					<nav className="mt-8">
						<LocalizedLink
							href="/about"
							className="inline-block px-8 py-4 bg-white text-[#667eea] no-underline rounded-lg font-semibold transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
						>
							{locale === "fr" ? "À propos" : "About"}
						</LocalizedLink>
					</nav>
				</div>
			</main>
		</I18nProvider>
	);
}
