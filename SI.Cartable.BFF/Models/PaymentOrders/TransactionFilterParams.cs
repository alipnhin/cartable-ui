using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.Enums;

namespace SI.Cartable.BFF.Models.PaymentOrders;

public class TransactionFilterParams: PaginationParams
{
    public Guid WithdrawalOrderId { get; set; }

    public string SerchValue { get; set; } = string.Empty;

    /// <summary>
    /// علل پرداخت
    /// </summary>

    public TransactionReasonEnum? ReasonCode { get; set; }



    public PaymentItemStatusEnum? Status { get; set; }

    /// <summary>
    /// نوع تراکنش
    /// </summary>
    public PaymentMethodEnum? PaymentType { get; set; }
}
