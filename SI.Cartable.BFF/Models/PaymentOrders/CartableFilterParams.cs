using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.Enums;

namespace SI.Cartable.BFF.Models.PaymentOrders;

public class CartableFilterParams : PaginationParams
{
    public string TrackingId { get; set; } = string.Empty;

    public string OrderId { get; set; } = string.Empty;


    public string Name { get; set; } = string.Empty;

    public string SourceIban { get; set; } = string.Empty;

    public Guid? BankGatewayId { get; set; }

    public Guid? AccountGroupId { get; set; }

    public PaymentStatusEnum? Status { get; set; }


    public DateTimeOffset? FromDate { get; set; }
    public DateTimeOffset? ToDate { get; set; }
}
