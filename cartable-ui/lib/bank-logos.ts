/**
 * Bank Logo Mapping
 * نقشه لوگوی بانک‌های ایرانی
 */

export const BANK_LOGOS: Record<string, string> = {
  "010": "/assets/media/bank-logos/010.png",
  "011": "/assets/media/bank-logos/011.png",
  "012": "/assets/media/bank-logos/012.png",
  "013": "/assets/media/bank-logos/013.png",
  "014": "/assets/media/bank-logos/014.png",
  "015": "/assets/media/bank-logos/015.png",
  "016": "/assets/media/bank-logos/016.png",
  "017": "/assets/media/bank-logos/017.png",
  "018": "/assets/media/bank-logos/018.png",
  "019": "/assets/media/bank-logos/019.png",
  "020": "/assets/media/bank-logos/020.png",
  "021": "/assets/media/bank-logos/021.png",
  "022": "/assets/media/bank-logos/022.png",
  "051": "/assets/media/bank-logos/051.png",
  "052": "/assets/media/bank-logos/052.png",
  "053": "/assets/media/bank-logos/053.png",
  "054": "/assets/media/bank-logos/054.png",
  "055": "/assets/media/bank-logos/055.png",
  "056": "/assets/media/bank-logos/056.png",
  "057": "/assets/media/bank-logos/057.png",
  "058": "/assets/media/bank-logos/058.png",
  "059": "/assets/media/bank-logos/059.png",
  "060": "/assets/media/bank-logos/060.png",
  "061": "/assets/media/bank-logos/061.png",
  "062": "/assets/media/bank-logos/062.png",
  "063": "/assets/media/bank-logos/063.png",
  "064": "/assets/media/bank-logos/064.png",
  "065": "/assets/media/bank-logos/065.png",
  "066": "/assets/media/bank-logos/066.png",
  "069": "/assets/media/bank-logos/069.png",
  "070": "/assets/media/bank-logos/070.png",
  "073": "/assets/media/bank-logos/073.png",
};

export const BANK_NAMES: Record<string, string> = {
  "010": "بانک مرکزی",
  "011": "بانک صنعت و معدن",
  "012": "بانک ملت",
  "013": "بانک رفاه",
  "014": "بانک مسکن",
  "015": "بانک سپه",
  "016": "بانک کشاورزی",
  "017": "بانک ملی",
  "018": "بانک تجارت",
  "019": "بانک صادرات",
  "020": "بانک توسعه صادرات",
  "021": "پست بانک",
  "022": "بانک توسعه تعاون",
  "051": "موسسه کوثر",
  "052": "موسسه توسعه",
  "053": "بانک کارآفرین",
  "054": "بانک پارسیان",
  "055": "بانک اقتصاد نوین",
  "056": "بانک سامان",
  "057": "بانک پاسارگاد",
  "058": "بانک سرمایه",
  "059": "بانک سینا",
  "060": "بانک مهر ایران",
  "061": "بانک شهر",
  "062": "بانک آینده",
  "063": "بانک انصار",
  "064": "بانک گردشگری",
  "065": "بانک حکمت ایرانیان",
  "066": "بانک دی",
  "069": "بانک ایران زمین",
  "070": "بانک رسالت",
  "073": "بانک خاورمیانه",
};

export const getBankLogo = (bankCode: string): string => {
  return BANK_LOGOS[bankCode] || "/assets/media/bank-logos/default.png";
};

export const getBankName = (bankCode: string): string => {
  return BANK_NAMES[bankCode] || "نامشخص";
};

export const getBankCodeFromIban = (iban: string): string => {
  if (iban.startsWith("IR") && iban.length >= 7) {
    return iban.substring(4, 7);
  }
  return "";
};
