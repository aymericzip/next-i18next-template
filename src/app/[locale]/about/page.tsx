import type { ResourceLanguage } from "i18next";
import { initI18next } from "@/app/i18n/server";
import ClientComponent from "@/components/ClientComponent";
import I18nProvider from "@/components/I18nProvider";
import LocalizedLink from "@/components/LocalizedLink";
import ServerComponent from "@/components/ServerComponent";
import type { Locale } from "@/i18n.config";
import type { Namespace } from "@/i18n.namespaces";

/**
 * Server component page that handles i18n initialization
 * Pre-loads translations on the server and passes them to client components
 */
export default async function AboutPage({
	params: { locale },
}: {
	params: { locale: Locale };
}) {
	// Define which translation namespaces this page needs
	// Using 'as const' for type safety and better autocomplete
	const namespaces = [
		"common",
		"about",
	] as const satisfies readonly Namespace[];

	// Initialize i18next on the server with required namespaces
	// This loads translation JSON files server-side
	const i18n = await initI18next(locale, namespaces);

	// Get a fixed translation function for the "about" namespace
	// getFixedT locks the namespace, so t("title") instead of t("about:title")
	const tAbout = i18n.getFixedT(locale, "about");

	// Extract translation bundles from the i18n instance
	// This data is passed to I18nProvider to hydrate client-side i18n
	// Prevents FOUC (Flash of Untranslated Content) and avoids duplicate fetching
	const resources = Object.fromEntries(
		namespaces.map((ns) => [
			ns,
			i18n.getResourceBundle(locale, ns) as ResourceLanguage,
		]),
	) as Record<Namespace, ResourceLanguage>;

	return (
		<I18nProvider locale={locale} namespaces={namespaces} resources={resources}>
			<main className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-8">
				<div className="max-w-3xl mx-auto">
					<nav className="mb-8">
						<LocalizedLink
							href="/"
							className="text-white no-underline opacity-90 hover:opacity-100 transition-opacity duration-200"
						>
							← {locale === "fr" ? "Retour" : "Back"}
						</LocalizedLink>
					</nav>
					<h1 className="text-5xl font-bold mb-4">{tAbout("title")}</h1>
					<p className="text-xl opacity-90 mb-12">{tAbout("description")}</p>

					<section className="bg-white/10 rounded-xl p-8 mb-8 backdrop-blur-md">
						<h2 className="text-3xl font-semibold mb-4">
							{locale === "fr" ? "Composant Client" : "Client Component"}
						</h2>
						<ClientComponent />
					</section>

					<section className="bg-white/10 rounded-xl p-8 mb-8 backdrop-blur-md">
						<h2 className="text-3xl font-semibold mb-4">
							{locale === "fr" ? "Composant Serveur" : "Server Component"}
						</h2>
						<ServerComponent t={tAbout} locale={locale} count={0} />
					</section>
				</div>
			</main>
		</I18nProvider>
	);
}
