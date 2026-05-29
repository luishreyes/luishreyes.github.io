import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { nav } from './strings/nav';
import { about } from './strings/about';
import { research } from './strings/research';
import { teaching } from './strings/teaching';
import { recognition } from './strings/recognition';
import { service } from './strings/service';
import { future } from './strings/future';
import { principles } from './strings/principles';

export type Lang = 'en' | 'es';

// ── UI strings (merged from per-section modules) ────────────
const ui = {
  ...nav,
  ...about,
  ...research,
  ...teaching,
  ...recognition,
  ...service,
  ...future,
  ...principles,
};

export type UIKey = keyof typeof ui;

// ── Localized data helper ───────────────────────────────────
// A data field that may be bilingual ({ en, es }) or a plain string
// (used for content that stays identical in both languages, e.g.
// thesis titles, foreign-university course names, Supabase publications).
export type Localized = string | { en: string; es: string };

export function localize(value: Localized | undefined | null, lang: Lang): string {
  if (value == null) return '';
  return typeof value === 'string' ? value : value[lang];
}

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: UIKey) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = 'lhr-academic-lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === 'en' || saved === 'es') return saved;
    // Default to Spanish if the browser is Spanish, else English
    return navigator.language.startsWith('es') ? 'es' : 'en';
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState(l => (l === 'en' ? 'es' : 'en'));
  const t = (key: UIKey) => ui[key][lang];

  return (
    <I18nContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
