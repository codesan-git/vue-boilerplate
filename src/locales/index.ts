import enCommon from './en/common.json';
import idCommon from './id/common.json';
import arCommon from './ar/common.json';

export const resources = {
  en: {
    common: enCommon,
  },
  id: {
    common: idCommon,
  },
  ar: {
    common: arCommon,
  },
} as const;

export type Locale = keyof typeof resources;
export type Namespace = keyof typeof resources['en'];