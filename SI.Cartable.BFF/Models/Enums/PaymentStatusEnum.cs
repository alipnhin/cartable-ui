using System.ComponentModel.DataAnnotations;

namespace SI.Cartable.BFF.Models.Enums;

public enum PaymentStatusEnum
{
    /// <summary>
    /// در انتظار تائید امضاداران
    /// </summary>
    [Display(Name = "در انتظار تائید")]
    WaitingForOwnersApproval = 0,


    /// <summary>
    /// تائید شده توسط امضاداران
    /// </summary>
    [Display(Name = "تائید شده")]
    OwnersApproved = 1,


    /// <summary>
    /// ارسال شده به بانک جهت پردازش
    /// </summary>
    [Display(Name = "ارسال شده به بانک")]
    SubmittedToBank = 2,


    /// <summary>
    /// تراکنش با موفقیت انجام شده
    /// 
    /// </summary>
    [Display(Name = "انجام شده")]
    BankSucceeded = 3,


    /// <summary>
    /// عدم تائید توسط امضا داران
    /// </summary>
    [Display(Name = "عدم تائید")]
    OwnerRejected = 4,


    /// <summary>
    /// رد شده توسط بانک
    /// </summary>
    [Display(Name = "رد شده توسط بانک")]
    BankRejected = 5,


    /// <summary>
    /// پیش نویس
    /// درخواست در انتظار تاید از سوی برنامه صادر کننده تراکنش میباشد
    /// </summary>
    [Display(Name = "پیش نویس")]
    Draft = 6,

    /// <summary>
    /// انجام شده با خطا
    /// وضعیتی که در یک دستور پرداخت تعدادی به هر دلیلی انجام نشده باشد و مابقی موفق باشد
    /// </summary>
    [Display(Name = "انجام شده با خطا")]
    DoneWithError = 7,

    /// <summary>
    /// لغو درخواست پرداخت در شرایط ویژه و اعلام از طریق مشتری
    /// </summary>
    [Display(Name = "لغو شده")]
    Canceled = 8,

    /// <summary>
    /// منقضی شدن درخواست پس از یک تایم مشخص(تنظیم شده) در صورت عدم تائید و ارسال به بانک
    /// </summary>
    [Display(Name = "منقضی شده")]
    Expired = 9,

    /// <summary>
    /// در صورت فعال بودن قبل از نمایش به امضاداران درخواست توسط مدیر کارتابل رد یا تایید می گردد
    /// </summary>
    [Display(Name = "در انتظار تایید مدیر کارتابل")]
    WaitForManagerApproval = 10
}
