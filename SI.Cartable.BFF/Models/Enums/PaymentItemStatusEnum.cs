using System.ComponentModel.DataAnnotations;

namespace SI.Cartable.BFF.Models.Enums;

public enum PaymentItemStatusEnum
{


    /// <summary>
    /// ثبت شده
    /// </summary>
    [Display(Name = "ثبت شده")]
    Registered = 0,

    /// <summary>
    /// در صف پردازش کارتایل
    /// </summary>
    [Display(Name = "در صف پردازش")]
    WaitForExecution = 1,


    /// <summary>
    /// ارسال شده بانک
    /// </summary>
    [Display(Name = "ارسال شده به بانک")]
    WaitForBank = 2,


    /// <summary>
    /// تراکنش با موفقیت انجام شده
    /// </summary>
    [Display(Name = "تراکنش انجام شده")]
    BankSucceeded = 3,


    /// <summary>
    /// رد شده توسط بانک
    /// </summary>
    [Display(Name = "رد شده توسط بانک")]
    BankRejected = 4,


    /// <summary>
    /// مبلغ به حساب مبدا برگشت داده شده است
    /// </summary>
    [Display(Name = "برگشت مبلغ به حساب مبدا")]
    TransactionRollback = 5,

    /// <summary>
    /// خطا در ارسال به بانک
    /// </summary>
    [Display(Name = "خطا در ارسال به بانک")]
    Failed = 6,

    /// <summary>
    /// لغو درخواست پرداخت در شرایط ویژه و اعلام از طریق مشتری
    /// </summary>
    [Display(Name = "لغو شده")]
    Canceled = 7,

    /// <summary>
    /// منقضی شدن درخواست پس از یک تایم مشخص(تنظیم شده) در صورت عدم تائید و ارسال به بانک
    /// </summary>
    [Display(Name = "منقضی شده")]
    Expired = 8
}
