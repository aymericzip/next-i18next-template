"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { defaultLocale, type Locale, locales } from "@/i18n.config";

export default function LocaleSwitcher() {
	const params = useParams();
	const pathname = usePathname();
	const activeLocale = (params?.locale as Locale | undefined) ?? defaultLocale;

	const getLocaleLabel = (locale: Locale): string => {
		try {
			const displayNames = new Intl.DisplayNames([locale], { type: "language" });
			return displayNames.of(locale) ?? locale.toUpperCase();
		} catch {
			return locale.toUpperCase();
		}
	};

	const basePath = useMemo(() => {
		if (!pathname) return "/";
		const segments = pathname.split("/").filter(Boolean);
		if (segments.length === 0) return "/";

		const maybeLocale = segments[0] as Locale;
		if ((locales as readonly string[]).includes(maybeLocale)) {
			const rest = segments.slice(1).join("/");
			return rest ? `/${rest}` : "/";
		}
		return pathname;
	}, [pathname]);

	const hrefForLocale = (nextLocale: Locale) => {
		if (nextLocale === defaultLocale) {
			return basePath;
		}
		return basePath === "/" ? `/${nextLocale}` : `/${nextLocale}${basePath}`;
	};

	return (
		<nav
			aria-label="Language selector"
			className="p-4 flex justify-center items-center"
		>
			<ul className="list-none flex gap-4 p-0 m-0 bg-gray-100 rounded-lg px-4 py-2">
				{(locales as readonly Locale[]).map((locale) => (
					<li key={locale}>
						<Link
							href={hrefForLocale(locale)}
							aria-current={locale === activeLocale ? "page" : undefined}
							className={`
                no-underline px-4 py-2 rounded-md font-medium transition-all duration-200
                ${
									locale === activeLocale
										? "bg-blue-600 text-white hover:bg-blue-700"
										: "text-gray-700 hover:bg-gray-300"
								}
              `}
						>
							{getLocaleLabel(locale)}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
