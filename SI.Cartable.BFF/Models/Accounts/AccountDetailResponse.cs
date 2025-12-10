using SI.Cartable.BFF.Models.Enums;

namespace SI.Cartable.BFF.Models.Accounts;

public class AccountDetailResponse
{
    public Guid Id { get; set; }
    public Guid BankId { get; set; }
    public string BankName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string BankCode { get; set; } = string.Empty;
    public string ShebaNumber { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public bool IsAccountNumberRequierd { get; set; }
    public int BatchSize { get; set; }
    public bool IsEnable { get; set; }

    public bool HasCartable { get; set; }
    public bool HasBankInquiry { get; set; }
    public long AccountBalance { get; set; }
    public short MinimumSignature { get; set; }
    public bool HasCartableManager { get; set; }
    public List<AccountUser> Users { get; set; } = new();
}

public class AccountUser
{
    public Guid Id { get; set; }
    public string UserId { get; set; }
    public Guid BankGatewayId { get; set; }
    public BankGatewayUserStatusEnum Status { get; set; }
    public string FullName { get; set; } = string.Empty;
    public DateTimeOffset CreatedDateTime { get; set; }
    public DateTimeOffset UpdatedDateTime { get; set; }

    public Guid TenantId { get; set; }
    public string TenantName { get; set; } = string.Empty;

    public string BankName { get; set; } = string.Empty;
    public string BankCode { get; set; } = string.Empty;

    public string BankGatewayTitle { get; set; } = string.Empty;

    public string AccountNumber { get; set; } = string.Empty;
}
