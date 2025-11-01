"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Client component example using React hooks for translations
 * Can use hooks like useState, useEffect, and useTranslation
 */
const ClientComponent = () => {
  // useTranslation hook provides access to translation function and i18n instance
  // Specify namespace to only load translations for "about" namespace
  const { t, i18n } = useTranslation("about");
  const [count, setCount] = useState(0);

  // Create locale-aware number formatter
  // i18n.language provides current locale (e.g., "en", "fr")
  // Intl.NumberFormat formats numbers according to locale conventions
  const numberFormat = new Intl.NumberFormat(i18n.language);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Format number using locale-specific formatting */}
      <p className="text-5xl font-bold text-white m-0">{numberFormat.format(count)}</p>
      <button
        type="button"
        className="px-8 py-3 bg-white text-[#667eea] border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
        aria-label={t("counter.label")}
        onClick={() => setCount((c) => c + 1)}
      >
        {t("counter.increment")}
      </button>
    </div>
  );
};

export default ClientComponent;

