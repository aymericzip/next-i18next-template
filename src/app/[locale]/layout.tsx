import type { Metadata } from "next";
import type { ReactNode } from "react";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import {
	absoluteUrl,
	defaultLocale,
	isRtl,
	type Locale,
	locales,
	localizedPath,
} from "@/i18n.config";
import "@/app/globals.css";

// Disable dynamic params - all locales must be known at build time
// This ensures static generation for all locale routes
export const dynamicParams = false;

/**
 * Generate static params for all locales at build time
 * Next.js will pre-render pages for each locale returned here
 * Example: [{ locale: "en" }, { locale: "fr" }]
 */
export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

/**
 * Generate SEO metadata for the root layout
 */
export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const { locale } = params;

	// Create hreflang mapping for all locales
	const languages = Object.fromEntries(
		locales.map((locale) => [locale, localizedPath(locale, "/")]),
	);

	return {
		title: {
			default:
				locale === "fr" ? "Application Next.js i18n" : "Next.js i18n App",
			template: `%s | ${locale === "fr" ? "Application Next.js i18n" : "Next.js i18n App"}`,
		},
		description:
			locale === "fr"
				? "Exemple d'application Next.js avec internationalisation utilisant i18next"
				: "Example Next.js application with internationalization using i18next",
		alternates: {
			canonical: absoluteUrl(locale, "/"),
			languages: {
				...languages,
				"x-default": absoluteUrl(defaultLocale, "/"),
			},
		},
	};
}

/**
 * Root layout component that handles locale-specific HTML attributes
 * Sets the lang attribute and text direction (ltr/rtl) based on locale
 */
export default function LocaleLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: { locale: string };
}) {
	// Validate locale from URL params
	// If invalid locale is provided, fall back to default locale
	const locale: Locale = (locales as readonly string[]).includes(params.locale)
		? (params.locale as Locale)
		: defaultLocale;

	// Determine text direction based on locale
	// RTL languages like Arabic need dir="rtl" for proper text rendering
	const dir = isRtl(locale) ? "rtl" : "ltr";

	return (
		<html lang={locale} dir={dir} className="antialiased">
			<body className="font-sans">
				<LocaleSwitcher />
				{children}
			</body>
		</html>
	);
}
