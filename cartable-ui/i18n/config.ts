// src/config/languages.ts
export interface Language {
  code: string;
  name: string;
  shortName: string;
  direction: "ltr" | "rtl";
  flag: string;
}

export const I18N_LANGUAGES: Language[] = [
  {
    code: "fa",
    name: "فارسی",
    shortName: "FA",
    direction: "rtl",
    flag: "/media/flags/iran.svg",
  },
  {
    code: "en",
    name: "English",
    shortName: "EN",
    direction: "ltr",
    flag: "/media/flags/united-states.svg",
  },
  // {
  //   code: "ar",
  //   name: "Arabic",
  //   shortName: "AR",
  //   direction: "rtl",
  //   flag: "/media/flags/saudi-arabia.svg",
  // },
];
export const DEFAULT_LANGUAGE = "fa";
export const SUPPORTED_LANGUAGES = I18N_LANGUAGES.map((lang) => lang.code);
