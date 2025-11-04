import { useTranslation as useI18nextTranslation } from "react-i18next";

// Enhanced useTranslation with locale
const useTranslation = (namespace?: string) => {
  const { t, i18n, ready } = useI18nextTranslation(namespace);
  
  return {
    t,
    i18n,
    ready,
    locale: i18n.language,
  };
};

// Helper function for typed translation keys
export const useTypedTranslation = () => {
  const { t, i18n } = useI18nextTranslation();

  return {
    t,
    i18n,
    locale: i18n.language,
    // Helper functions for common translation patterns
    tApp: (key: string) => t(`app.${key}`),
    tButton: (key: string) => t(`common.buttons.${key}`),
    tLabel: (key: string) => t(`common.labels.${key}`),
    tMessage: (key: string) => t(`common.messages.${key}`),
    tNav: (key: string) => t(`navigation.${key}`),
    tUser: (key: string) => t(`userMenu.${key}`),
    tPayment: (key: string) => t(`paymentCartable.${key}`),
    tStatus: (key: string) => t(`paymentCartable.statusLabels.${key}`),
    tAccountGroup: (key: string) => t(`paymentCartable.accountGroups.${key}`),
  };
};

export default useTranslation;
