/**
 * PesaPlan Translation Bridge
 *
 * i18n.ts is the single source of truth for all translation strings.
 * This module re-exports the `t(key, lang)` function so components
 * don't need to change their imports.
 *
 * Components: import { t } from '@/app/utils/translations'
 * New components (React): use useTranslation() from react-i18next directly.
 */

import i18n, { type AppTranslations } from '@/i18n';
import type { Language } from '@/app/App';

export type TranslationKey = keyof AppTranslations;

/**
 * Synchronous translation function — safe for use anywhere (class components,
 * callbacks, contexts). Falls back to the key name if not found.
 */
export function t(key: TranslationKey, lang: Language): string {
  return i18n.t(key, { lng: lang }) as string;
}
