# Next.js i18next Example

A complete implementation of internationalization (i18n) in Next.js 16 using `i18next` and `react-i18next` with the App Router.

## Features

- ✅ **Full i18next integration** with Next.js App Router
- ✅ **TypeScript support** with strongly typed translation keys
- ✅ **Server and Client components** with proper SSR and hydration
- ✅ **SEO optimized** with proper metadata, sitemap, and robots.txt
- ✅ **Locale detection** with automatic redirection via middleware
- ✅ **Locale switcher** with styled UI component
- ✅ **Namespace-based translations** for better organization
- ✅ **Dynamic locale routing** with static generation

## Supported Locales

- English (en) - Default
- French (fr)

## Project Structure

```
.
├── i18n.config.ts                    # i18n configuration
└── src
    ├── locales
    │   ├── en
    │   │  ├── common.json            # Common translations
    │   │  └── about.json             # About page translations
    │   └── fr
    │      ├── common.json
    │      └── about.json
    ├── app
    │   ├── i18n
    │   │   └── server.ts             # Server-side i18n initialization
    │   ├── actions
    │   │   └── get-current-locale.ts # Server actions for locale
    │   └── [locale]
    │       ├── layout.tsx            # Root layout with locale handling
    │       ├── page.tsx              # Home page
    │       └── about
    │           ├── layout.tsx        # About page metadata
    │           └── page.tsx          # About page
    ├── components
    │   ├── I18nProvider.tsx          # Client-side i18n provider
    │   ├── ClientComponent.tsx       # Example client component
    │   ├── ServerComponent.tsx       # Example server component
    │   ├── LocaleSwitcher.tsx        # Language switcher UI
    │   └── LocalizedLink.tsx         # Locale-aware Link component
    ├── middleware.ts                 # Locale detection middleware
    ├── i18n.namespaces.ts           # Translation namespaces
    └── types
        └── i18next.d.ts             # TypeScript augmentation
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app. You'll be automatically redirected to your locale (e.g., `/en` or `/fr` based on your browser language).

### Build for Production

```bash
npm run build
npm start
```

## How It Works

### 1. Locale Configuration

All locale configuration is centralized in `i18n.config.ts`:

```typescript
export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
```

### 2. Translation Namespaces

Translations are organized by namespace in `src/i18n.namespaces.ts`:

```typescript
export const namespaces = ["common", "about"] as const;
export type Namespace = (typeof namespaces)[number];
```

### 3. TypeScript Support

Translation keys are strongly typed via TypeScript declaration merging in `src/types/i18next.d.ts`:

```typescript
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof import("@/locales/en/common.json");
      about: typeof import("@/locales/en/about.json");
    };
  }
}
```

This provides autocomplete and type safety for all translation keys.

### 4. Server-Side Initialization

Pages initialize i18next on the server to load translations before rendering:

```typescript
const i18n = await initI18next(locale, namespaces);
const t = i18n.getFixedT(locale, "common");
```

### 5. Client-Side Hydration

The `I18nProvider` receives pre-loaded translations from the server to prevent FOUC (Flash of Untranslated Content):

```tsx
<I18nProvider locale={locale} namespaces={namespaces} resources={resources}>
  {children}
</I18nProvider>
```

### 6. Locale Detection

The middleware automatically detects the user's preferred locale and redirects:

1. Checks for `NEXT_LOCALE` cookie (user preference)
2. Falls back to `Accept-Language` header (browser language)
3. Redirects to locale-prefixed URL (e.g., `/` → `/en`)

### 7. SEO Optimization

- **Metadata**: Each page generates localized metadata with hreflang tags
- **Sitemap**: Includes all locale versions of each page
- **Robots.txt**: Properly excludes protected routes for all locales

## Usage Examples

### Using Translations in Client Components

```tsx
"use client";
import { useTranslation } from "react-i18next";

export default function MyComponent() {
  const { t, i18n } = useTranslation("common");
  
  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>Current locale: {i18n.language}</p>
    </div>
  );
}
```

### Using Translations in Server Components

```tsx
import { initI18next } from "@/app/i18n/server";

export default async function MyPage({ params: { locale } }) {
  const i18n = await initI18next(locale, ["common"]);
  const t = i18n.getFixedT(locale, "common");
  
  return <h1>{t("welcome")}</h1>;
}
```

### Creating Localized Links

```tsx
import LocalizedLink from "@/components/LocalizedLink";

export default function Nav() {
  return (
    <nav>
      <LocalizedLink href="/">Home</LocalizedLink>
      <LocalizedLink href="/about">About</LocalizedLink>
    </nav>
  );
}
```

## Adding a New Locale

1. Add the locale to `i18n.config.ts`:
   ```typescript
   export const locales = ["en", "fr", "es"] as const;
   ```

2. Create translation files:
   ```
   src/locales/es/common.json
   src/locales/es/about.json
   ```

3. Update `LocaleSwitcher.tsx` with the new locale label:
   ```typescript
   const localeLabels: Record<Locale, string> = {
     en: "English",
     fr: "Français",
     es: "Español",
   };
   ```

4. Rebuild the app:
   ```bash
   npm run build
   ```

## Adding a New Page

1. Create the page file:
   ```
   src/app/[locale]/new-page/page.tsx
   ```

2. Create translation files:
   ```
   src/locales/en/new-page.json
   src/locales/fr/new-page.json
   ```

3. Add namespace to `src/i18n.namespaces.ts`:
   ```typescript
   export const namespaces = ["common", "about", "new-page"] as const;
   ```

4. Update TypeScript types in `src/types/i18next.d.ts`:
   ```typescript
   interface CustomTypeOptions {
     resources: {
       common: typeof import("@/locales/en/common.json");
       about: typeof import("@/locales/en/about.json");
       "new-page": typeof import("@/locales/en/new-page.json");
     };
   }
   ```

5. Add to sitemap in `src/app/sitemap.ts`:
   ```typescript
   const pages = ["/", "/about", "/new-page"];
   ```

## Best Practices

1. **Use namespaces** to organize translations by feature/page
2. **Load only required namespaces** per page to reduce bundle size
3. **Pre-load translations** on the server to prevent FOUC
4. **Use TypeScript** for type-safe translation keys
5. **Set HTML lang and dir attributes** for accessibility and SEO
6. **Generate static pages** when possible for better performance
7. **Keep server components synchronous** by passing pre-translated strings

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [Intlayer Documentation](https://github.com/aymericzip/intlayer)

## License

MIT
