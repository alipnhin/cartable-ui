using SI.Cartable.BFF.Models.Enums;

namespace SI.Cartable.BFF.Models.PaymentOrders;

public class PaymentListDto
{
    public Guid Id { get; set; }

    public string OrderId { get; set; } = string.Empty;

    
    /// <summary>
    /// کد پیگیری ارائه شده از سوی بانک
    /// </summary>
    public string TrackingId { get; set; } = string.Empty;

    /// <summary>
    /// عنوان تراکنش
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// توضیحات دستور پرداخت
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// شماره شبای حساب مبدا
    /// </summary>

    public string SourceIban { get; set; } = string.Empty;


    /// <summary>
    /// شناسه حساب تعریف شده در ادمین
    /// </summary>
    public Guid BankGatewayId { get; set; }

    public Guid TenantId { get; set; }

    /// <summary>
    /// کارمزد تراکنش ها
    /// </summary>
    public long TransactionsFee { get; set; }

    public string BankCode { get; set; } = string.Empty;
    public string BankName { get; set; } = string.Empty;
    public string GatewayTitle { get; set; } = string.Empty;

    public string AccountNumber { get; set; } = string.Empty;

    /// <summary>
    /// مبلغ کل تراکنش
    /// </summary>

    public string TotalAmount { get; set; } = string.Empty;

    /// <summary>
    /// تعداد ردیف تراکنش
    /// </summary>

    public string NumberOfTransactions { get; set; } = string.Empty;

    public PaymentStatusEnum Status { get; set; }
    public DateTimeOffset CreatedDateTime { get; set; }
    public DateTimeOffset UpdatedDateTime { get; set; }
}
