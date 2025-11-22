/**
 * Theme Configuration
 * پیکربندی تم‌های رنگی برنامه
 *
 * تم‌های جدید را با اضافه کردن به این فایل و styles/themes.css فعال کنید
 */

export interface ColorTheme {
  /** شناسه یکتا - باید با کلاس CSS در themes.css مطابقت داشته باشد */
  id: string;
  /** نام ترجمه‌شده تم */
  nameKey: string;
  /** رنگ نمایشی برای پیش‌نمایش */
  previewColor: string;
  /** رنگ ثانویه برای gradient پیش‌نمایش */
  previewColorSecondary?: string;
  /** توضیحات (اختیاری) */
  descriptionKey?: string;
}

/**
 * لیست تم‌های موجود
 * برای اضافه کردن تم جدید:
 * 1. کلاس CSS را در styles/themes.css اضافه کنید
 * 2. تم را به این لیست اضافه کنید
 */
export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'default',
    nameKey: 'themes.default',
    previewColor: '#4CAF50',
    previewColorSecondary: '#81C784',
    descriptionKey: 'themes.defaultDesc',
  },
  {
    id: 'theme-blue',
    nameKey: 'themes.blue',
    previewColor: '#3B82F6',
    previewColorSecondary: '#60A5FA',
    descriptionKey: 'themes.blueDesc',
  },
  {
    id: 'theme-violet',
    nameKey: 'themes.violet',
    previewColor: '#8B5CF6',
    previewColorSecondary: '#A78BFA',
    descriptionKey: 'themes.violetDesc',
  },
  {
    id: 'theme-emerald-finance',
    nameKey: 'themes.emeraldFinance',
    previewColor: '#059669',
    previewColorSecondary: '#34D399',
    descriptionKey: 'themes.emeraldFinanceDesc',
  },
  {
    id: 'theme-indigo-pro',
    nameKey: 'themes.indigoPro',
    previewColor: '#4F46E5',
    previewColorSecondary: '#818CF8',
    descriptionKey: 'themes.indigoProDesc',
  },
  {
    id: 'theme-red-elegant',
    nameKey: 'themes.redElegant',
    previewColor: '#DC2626',
    previewColorSecondary: '#F87171',
    descriptionKey: 'themes.redElegantDesc',
  },
  {
    id: 'theme-rose-passion',
    nameKey: 'themes.rosePassion',
    previewColor: '#E11D48',
    previewColorSecondary: '#FB7185',
    descriptionKey: 'themes.rosePassionDesc',
  },
];

/** تم پیش‌فرض */
export const DEFAULT_THEME_ID = 'default';

/** کلید ذخیره‌سازی در localStorage */
export const THEME_STORAGE_KEY = 'cartable-color-theme';
