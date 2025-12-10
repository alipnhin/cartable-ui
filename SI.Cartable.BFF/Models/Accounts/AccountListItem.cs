namespace SI.Cartable.BFF.Models.Accounts;

public class AccountListItem
{
    public Guid Id { get; set; }
    public Guid BankId { get; set; }
    public string BankName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string BankCode { get; set; } = string.Empty;
    public string ShebaNumber { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public bool IsEnable { get; set; }

    public bool HasCartable { get; set; }
    public bool HasCartableManager { get; set; }
    public bool HasBankInquiry { get; set; }
    public long AccountBalance { get; set; }

    public DateTimeOffset CreatedDateTime { get; set; }
}
