using SI.Cartable.BFF.Models.Enums;

namespace SI.Cartable.BFF.Models.PaymentOrders;

public class WithdrawalTransaction
{
    public Guid Id { get; set; }
    public string OrderId { get; set; } = string.Empty;


    /// <summary>
    /// شناسه پیگیری تراکنش که باید در هر دستور منحصربفرد باشد. 
    ///این پارامتر اختیاری است و در صورت عدم مقداردهی توسط
    ///کالینت، به صورت خودکار در پاسخ توسط سامانه مقداردهی می شود
    /// </summary>
    public string TrackingId { get; set; } = string.Empty;

    /// <summary>
    /// شناسه شبای حساب مقصد
    /// </summary>

    public string DestinationIban { get; set; } = string.Empty;

    /// <summary>
    /// کد ملی صاحب حساب مقصد
    /// </summary>
    public string NationalCode { get; set; } = string.Empty;

    /// <summary>
    /// شماره حساب مقصد
    /// </summary>
    public string AccountNumber { get; set; } = string.Empty;

    /// <summary>
    /// نام کامل صاحب حساب مقصد که برای انتقال وجه بین بانکی مورد استفاده قرار می گیرد.
    /// </summary>
    public string DestinationAccountOwner { get; set; } = string.Empty;


    /// <summary>
    /// نام صاحب حساب
    /// </summary>
    public string OwnerFirstName { get; set; } = string.Empty;

    /// <summary>
    /// نام خانوادگی صاحب حساب
    /// </summary>
    public string OwnerLastName { get; set; } = string.Empty;


    /// <summary>
    /// شرح سند واریز به حساب مقصد 
    /// </summary>
    public string Description { get; set; } = string.Empty;


    /// <summary>
    /// پاسخ بانک
    /// </summary>
    public string ProviderMessage { get; set; } = string.Empty;


    /// <summary>
    /// مبلغ تراکنش
    /// </summary>
    public string Amount { get; set; } = string.Empty;

    /// <summary>
    /// شناسه پرداخت 
    /// </summary>
    public string PaymentNumber { get; set; } = string.Empty;


    /// <summary>
    /// علل پرداخت
    /// </summary>

    public TransactionReasonEnum ReasonCode { get; set; }

    /// <summary>
    /// شماره صف ارسال
    /// </summary>
    public int RowNumber { get; set; }

    public PaymentItemStatusEnum Status { get; set; }

    /// <summary>
    /// نوع تراکنش
    /// </summary>
    public PaymentMethodEnum PaymentType { get; set; }

    public DateTimeOffset? TransferDateTime { get; set; }
    public DateTimeOffset CreatedDateTime { get; set; }

    public DateTimeOffset UpdatedDateTime { get; set; }


    /// <summary>
    /// کد حساب مشتری 
    /// </summary>
    public string AccountCode { get; set; } = string.Empty;
    public Guid WithdrawalOrderId { get; set; }

    public string MetaData { get; set; } = string.Empty;


    public List<WithdrawalTransactionLogDto> ChangeHistory { get; set; }
}


public sealed class WithdrawalTransactionLogDto 
{
    public Guid Id { get; set; }
    public Guid WithdrawalTransactionId { get; set; }

    public string Description { get; set; } = string.Empty;
    public PaymentItemStatusEnum Status { get; set; }

    public DateTimeOffset CreatedDateTime { get; set; }
}