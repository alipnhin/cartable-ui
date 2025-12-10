using SI.Cartable.BFF.Models.Enums;

namespace SI.Cartable.BFF.Models.Transactions;

public class TransactionItem
{
    public Guid Id { get; set; }
    public string DestinationAccountOwner { get; set; } = string.Empty;
    public string NationalCode { get; set; } = string.Empty;
    public string DestinationIban { get; set; } = string.Empty;

    public string BankName { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;

    public string AccountCode { get; set; } = string.Empty;

    public string OrderId { get; set; } = string.Empty;
    public long Amount { get; set; }
    public PaymentItemStatusEnum Status { get; set; }
    public DateTimeOffset CreatedDateTime { get; set; }

    public DateTimeOffset? UpdatedDateTime { get; set; }

    public DateTimeOffset? TransferDateTime { get; set; }

    public DateTimeOffset? SendToBankDateTime { get; set; }
    public PaymentMethodEnum PaymentType { get; set; }
}
