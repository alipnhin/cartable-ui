import { useTranslation as useI18nextTranslation } from 'react-i18next';

// Re-export useTranslation with proper typing
export const useTranslation = (namespace?: string) => {
  return useI18nextTranslation(namespace);
};

// Helper function for typed translation keys
export const useTypedTranslation = () => {
  const { t, i18n } = useI18nextTranslation();

  return {
    t,
    i18n,
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