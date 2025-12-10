using System.ComponentModel.DataAnnotations;

namespace SI.Cartable.BFF.Models.Enums
{
    public enum TransactionReasonEnum
    {
        [Display(Name = "نامشخص")]
        Unkown = 0,
        /// <summary>
        /// واريز حقوق
        /// </summary>
        [Display(Name = "واريز حقوق")]
        SalaryDeposit = 1,
        /// <summary>
        /// امور بیمه خدمات
        /// </summary>
        [Display(Name = "امور بیمه خدمات")]
        ServicesInsuarance = 2,
        /// <summary>
        /// امور درمانی
        /// </summary>
        [Display(Name = "امور درمانی")]
        Therapeutic = 3,
        /// <summary>
        /// امور سرمايه‌گذارى و بورس
        /// </summary>
        [Display(Name = "امور سرمايه‌گذارى و بورس")]
        InvestmentAndBourse = 4,
        /// <summary>
        /// امور ارزى در چارچوب ضوابط و مقررات
        /// </summary>
        [Display(Name = "امور ارزى در چارچوب ضوابط و مقررات")]
        LegalCurrencyActivities = 5,
        /// <summary>
        /// پرداخت قرض و تاديه ديون (قرض‌الحسنه، بدهى و غیره)
        /// </summary>
        [Display(Name = "پرداخت قرض و تاديه ديون (قرض‌الحسنه، بدهى و غیره)")]
        DebtPayment = 6,
        /// <summary>
        /// امور بازنشستگی
        /// </summary>
        [Display(Name = "امور بازنشستگی")]
        Retirement = 7,
        /// <summary>
        /// اموال منقول
        /// </summary>
        [Display(Name = "اموال منقول")]
        MovableProperties = 8,
        /// <summary>
        /// اموال غیر منقول
        /// </summary>
        [Display(Name = "اموال غیر منقول")]
        ImmovableProperties = 9,
        /// <summary>
        /// مدیریت نقدینگی
        /// </summary>
        [Display(Name = "مدیریت نقدینگی")]
        CashManagement = 10,
        /// <summary>
        /// عوارض گمرکى
        /// </summary>
        [Display(Name = "عوارض گمرکى")]
        CustomsDuties = 11,
        /// <summary>
        /// تسویه مالیاتی
        /// </summary>
        [Display(Name = "تسویه مالیاتی")]
        TaxSettle = 12,
        /// <summary>
        /// سایر خدمات دولتی
        /// </summary>
        [Display(Name = "سایر خدمات دولتی")]
        OtherGovermentServices = 13,
        /// <summary>
        /// تسهیلات و تعهدات
        /// </summary>
        [Display(Name = "تسهیلات و تعهدات")]
        FacilitiesAndCommitments = 14,
        /// <summary>
        /// بازگردانی وثیقه
        /// </summary>
        [Display(Name = "بازگردانی وثیقه")]
        BondReturn = 15,
        /// <summary>
        /// هزينه عمومى و امور روزمره
        /// </summary>
        [Display(Name = "هزينه عمومى و امور روزمره")]
        GeneralAndDailyCosts = 16,
        /// <summary>
        /// امور خیریه
        /// </summary>
        [Display(Name = "امور خیریه")]
        Charity = 17,
        /// <summary>
        /// خرید کالا
        /// </summary>
        [Display(Name = "خرید کال")]
        StuffsPurchase = 18,
        /// <summary>
        /// خرید خدمات
        /// </summary>
        [Display(Name = "خرید خدمات")]
        ServicesPurchase = 19
    }
}
