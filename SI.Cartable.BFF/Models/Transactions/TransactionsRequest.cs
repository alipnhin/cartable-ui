using SI.Cartable.BFF.Models.Common;

namespace SI.Cartable.BFF.Models.Transactions;

public class TransactionsRequest: PaginationParams
{
    public string? NationalCode { get; set; }
    public string? DestinationIban { get; set; }
    public string? AccountNumber { get; set; }
    public string? OrderId { get; set; }
    public string? BankGatewayId { get; set; }
    public string? AccountGroupId { get; set; }
    public string? PaymentType { get; set; }
    public string? Status { get; set; }
    public string? FromDate { get; set; }
    public string? ToDate { get; set; }
    public string? TransferFromDate { get; set; }
    public string? TransferToDate { get; set; }
}
