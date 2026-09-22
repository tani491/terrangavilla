"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { Check, ChevronDown, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type LanguageCode = "fr" | "en" | "es" | "pt" | "ar";

type LanguageOption = {
  code: LanguageCode;
  shortLabel: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
};

type GoogleTranslateElement = new (
  options: Record<string, unknown>,
  element: string
) => unknown;

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: GoogleTranslateElement;
      };
    };
  }
}

const SOURCE_LANGUAGE: LanguageCode = "fr";
const STORAGE_KEY = "teranga-preferred-language";
const LANGUAGE_EVENT = "teranga-language-change";
const TRANSLATE_READY_EVENT = "teranga-google-translate-ready";

const LANGUAGES: LanguageOption[] = [
  {
    code: "fr",
    shortLabel: "FR",
    name: "Français",
    nativeName: "Français",
    flag: "🇫🇷",
    dir: "ltr",
  },
  {
    code: "en",
    shortLabel: "EN",
    name: "Anglais",
    nativeName: "English",
    flag: "🇬🇧",
    dir: "ltr",
  },
  {
    code: "es",
    shortLabel: "ES",
    name: "Espagnol",
    nativeName: "Español",
    flag: "🇪🇸",
    dir: "ltr",
  },
  {
    code: "pt",
    shortLabel: "PT",
    name: "Portugais",
    nativeName: "Português",
    flag: "🇵🇹",
    dir: "ltr",
  },
  {
    code: "ar",
    shortLabel: "AR",
    name: "Arabe",
    nativeName: "العربية",
    flag: "🇸🇦",
    dir: "rtl",
  },
];

function isLanguageCode(value: string | null): value is LanguageCode {
  return LANGUAGES.some((language) => language.code === value);
}

function getLanguageOption(code: LanguageCode) {
  return (
    LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0]
  );
}

function readGoogleTranslateLanguage(): LanguageCode | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookieLanguage = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("googtrans="))
    ?.split("=")[1];

  if (cookieLanguage) {
    const [, , targetLanguage] = decodeURIComponent(cookieLanguage).split("/");
    if (isLanguageCode(targetLanguage)) {
      return targetLanguage;
    }
  }

  const htmlLanguage = document.documentElement.lang
    ?.split("-")[0]
    ?.toLowerCase();

  return isLanguageCode(htmlLanguage) ? htmlLanguage : null;
}

function readStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") {
    return SOURCE_LANGUAGE;
  }

  try {
    const storedLanguage = window.localStorage?.getItem(STORAGE_KEY);
    if (isLanguageCode(storedLanguage)) {
      return storedLanguage;
    }
  } catch {
    // localStorage can be unavailable in strict privacy contexts.
  }

  return readGoogleTranslateLanguage() ?? SOURCE_LANGUAGE;
}

function writeStoredLanguage(language: LanguageCode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // localStorage can be unavailable in strict privacy contexts.
  }
}

function setGoogTransCookie(language: LanguageCode) {
  const translatedPair = `/${SOURCE_LANGUAGE}/${language}`;
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  const baseCookie = `googtrans=${translatedPair}; expires=${expires.toUTCString()}; path=/`;
  document.cookie = `${baseCookie}; SameSite=Lax`;

  const { hostname } = window.location;
  if (hostname && hostname !== "localhost") {
    document.cookie = `${baseCookie}; domain=${hostname}; SameSite=Lax`;

    const rootDomain = hostname.split(".").slice(-2).join(".");
    if (rootDomain && rootDomain !== hostname) {
      document.cookie = `${baseCookie}; domain=.${rootDomain}; SameSite=Lax`;
    }
  }
}

function updateDocumentDirection(language: LanguageCode) {
  const option = getLanguageOption(language);
  document.documentElement.lang = language;
  document.documentElement.dir = option.dir;
  document.body.dir = option.dir;
  document.documentElement.classList.toggle("translated-rtl", option.dir === "rtl");
}

function triggerGoogleTranslate(language: LanguageCode, attempt = 0) {
  if (typeof document === "undefined") {
    return;
  }

  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!combo) {
    if (attempt < 12) {
      window.setTimeout(() => triggerGoogleTranslate(language, attempt + 1), 250);
    }
    return;
  }

  if (combo.value === language) {
    return;
  }

  combo.value = language;
  combo.dispatchEvent(new Event("change"));
}

function applyLanguage(language: LanguageCode, persist = true) {
  if (typeof window === "undefined") {
    return;
  }

  if (persist) {
    writeStoredLanguage(language);
  }

  updateDocumentDirection(language);
  setGoogTransCookie(language);
  triggerGoogleTranslate(language);
}

export function GoogleTranslateProvider() {
  useEffect(() => {
    const initialLanguage = readStoredLanguage();
    applyLanguage(initialLanguage, false);

    window.googleTranslateElementInit = () => {
      const container = document.getElementById("google_translate_element");
      const TranslateElement = window.google?.translate?.TranslateElement;

      if (!container || !TranslateElement) {
        return;
      }

      if (container.dataset.initialized !== "true") {
        new TranslateElement(
          {
            pageLanguage: SOURCE_LANGUAGE,
            includedLanguages: LANGUAGES.map((language) => language.code).join(","),
            autoDisplay: false,
          },
          "google_translate_element"
        );
        container.dataset.initialized = "true";
      }

      window.dispatchEvent(new Event(TRANSLATE_READY_EVENT));
      triggerGoogleTranslate(readStoredLanguage());
    };

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <>
      <div
        id="google_translate_element"
        aria-hidden="true"
        className="fixed left-[-9999px] top-0 h-px w-px overflow-hidden"
      />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`window.googleTranslateElementInit = window.googleTranslateElementInit || function(){ window.dispatchEvent(new Event("${TRANSLATE_READY_EVENT}")); };`}
      </Script>
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}

type LanguageSwitcherProps = {
  variant?: "desktop" | "mobile";
  className?: string;
};

export default function LanguageSwitcher({
  variant = "desktop",
  className,
}: LanguageSwitcherProps) {
  const [currentLanguage, setCurrentLanguage] =
    useState<LanguageCode>(SOURCE_LANGUAGE);

  useEffect(() => {
    const storedLanguage = readStoredLanguage();
    setCurrentLanguage(storedLanguage);
    applyLanguage(storedLanguage, false);

    const syncLanguage = (language: LanguageCode) => {
      setCurrentLanguage(language);
      applyLanguage(language, false);
    };

    const onLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ language?: LanguageCode }>;
      const nextLanguage = customEvent.detail?.language;
      if (nextLanguage && isLanguageCode(nextLanguage)) {
        syncLanguage(nextLanguage);
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && isLanguageCode(event.newValue)) {
        syncLanguage(event.newValue);
      }
    };

    const onTranslateReady = () => triggerGoogleTranslate(readStoredLanguage());

    window.addEventListener(LANGUAGE_EVENT, onLanguageChange);
    window.addEventListener("storage", onStorage);
    window.addEventListener(TRANSLATE_READY_EVENT, onTranslateReady);

    return () => {
      window.removeEventListener(LANGUAGE_EVENT, onLanguageChange);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(TRANSLATE_READY_EVENT, onTranslateReady);
    };
  }, []);

  const activeLanguage = useMemo(
    () => getLanguageOption(currentLanguage),
    [currentLanguage]
  );

  const handleLanguageChange = (language: LanguageCode) => {
    setCurrentLanguage(language);
    applyLanguage(language);
    window.dispatchEvent(
      new CustomEvent(LANGUAGE_EVENT, { detail: { language } })
    );
  };

  if (variant === "mobile") {
    return (
      <section
        aria-label="Langue / Language"
        translate="no"
        className={cn(
          "notranslate mt-3 rounded-md border border-[#D6A84A]/35 bg-[#141414] p-3 shadow-[0_0_22px_rgba(214,168,74,0.14)]",
          className
        )}
      >
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#D6A84A]">
          <Globe2 className="h-4 w-4" aria-hidden="true" />
          <span>Langue / Language</span>
        </div>
        <div className="grid grid-cols-2 gap-2 min-[430px]:grid-cols-3">
          {LANGUAGES.map((language) => {
            const isActive = language.code === currentLanguage;

            return (
              <button
                key={language.code}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  "flex min-h-14 items-center gap-2 rounded-md border px-3 py-2 text-left transition-all",
                  isActive
                    ? "border-[#D6A84A] bg-[#D6A84A] text-[#0B0B0B] shadow-[0_0_18px_rgba(214,168,74,0.24)]"
                    : "border-[#D6A84A]/20 bg-[#0B0B0B] text-[#F5F5F5] hover:border-[#D6A84A]/60 hover:bg-[#1c1c1c]"
                )}
              >
                <span className="text-xl leading-none" aria-hidden="true">
                  {language.flag}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold">
                    {language.nativeName}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-[0.12em]",
                      isActive ? "text-[#2B220E]" : "text-[#A7A7A7]"
                    )}
                  >
                    {language.shortLabel}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          translate="no"
          aria-label={`Changer la langue, langue active ${activeLanguage.nativeName}`}
          className={cn(
            "notranslate h-10 border-[#D6A84A]/70 bg-[#D6A84A]/10 px-3 text-[#F5F5F5] shadow-[0_0_22px_rgba(214,168,74,0.18)] hover:border-[#D6A84A] hover:bg-[#D6A84A]/20 hover:text-white",
            className
          )}
        >
          <Globe2 className="h-4 w-4 text-[#D6A84A]" aria-hidden="true" />
          <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] xl:inline">
            Langue
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold">
            <span aria-hidden="true">{activeLanguage.flag}</span>
            {activeLanguage.shortLabel}
          </span>
          <ChevronDown className="h-4 w-4 text-[#D6A84A]" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        translate="no"
        className="notranslate w-64 border-[#D6A84A]/25 bg-[#0B0B0B] p-2 text-[#F5F5F5] shadow-[0_18px_55px_rgba(0,0,0,0.55)]"
      >
        <DropdownMenuLabel className="flex items-center gap-2 px-2 text-xs uppercase tracking-[0.16em] text-[#D6A84A]">
          <Globe2 className="h-4 w-4" aria-hidden="true" />
          Traduire le site
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#D6A84A]/20" />
        {LANGUAGES.map((language) => {
          const isActive = language.code === currentLanguage;

          return (
            <DropdownMenuItem
              key={language.code}
              onSelect={() => handleLanguageChange(language.code)}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-2.5 text-[#F5F5F5] focus:bg-[#D6A84A]/15 focus:text-white",
                isActive && "bg-[#D6A84A]/10 text-[#D6A84A]"
              )}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {language.flag}
              </span>
              <span className="flex flex-1 flex-col">
                <span className="text-sm font-semibold">{language.nativeName}</span>
                <span className="text-xs text-[#A7A7A7]">
                  {language.shortLabel} · {language.name}
                </span>
              </span>
              {isActive ? (
                <Check className="h-4 w-4 text-[#D6A84A]" aria-hidden="true" />
              ) : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
