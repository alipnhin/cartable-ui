/**
 * Bank Logo Mapping
 * نقشه لوگوی بانک‌های ایرانی
 */

export const BANK_LOGOS: Record<string, string> = {
  "010": "/media/bank-logos/010.png",
  "011": "/media/bank-logos/011.png",
  "012": "/media/bank-logos/012.png",
  "013": "/media/bank-logos/013.png",
  "014": "/media/bank-logos/014.png",
  "015": "/media/bank-logos/015.png",
  "016": "/media/bank-logos/016.png",
  "017": "/media/bank-logos/017.png",
  "018": "/media/bank-logos/018.png",
  "019": "/media/bank-logos/019.png",
  "020": "/media/bank-logos/020.png",
  "021": "/media/bank-logos/021.png",
  "022": "/media/bank-logos/022.png",
  "051": "/media/bank-logos/051.png",
  "052": "/media/bank-logos/052.png",
  "053": "/media/bank-logos/053.png",
  "054": "/media/bank-logos/054.png",
  "055": "/media/bank-logos/055.png",
  "056": "/media/bank-logos/056.png",
  "057": "/media/bank-logos/057.png",
  "058": "/media/bank-logos/058.png",
  "059": "/media/bank-logos/059.png",
  "060": "/media/bank-logos/060.png",
  "061": "/media/bank-logos/061.png",
  "062": "/media/bank-logos/062.png",
  "063": "/media/bank-logos/063.png",
  "064": "/media/bank-logos/064.png",
  "065": "/media/bank-logos/065.png",
  "066": "/media/bank-logos/066.png",
  "069": "/media/bank-logos/069.png",
  "070": "/media/bank-logos/070.png",
  "073": "/media/bank-logos/073.png",
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
  return BANK_LOGOS[bankCode] || "/media/bank-logos/999.png";
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
