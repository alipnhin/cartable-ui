namespace SI.Cartable.BFF.Models.AccountGroups;

public class AccountGroup
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public int AccountCount { get; set; }
    public bool IsEnable { get; set; }
    public string Color { get; set; } = string.Empty;
}

public class AccountGroupDetail : AccountGroup
{
    public List<AccountGroupItem> Accounts { get; set; } = new();
}

public class AccountGroupItem
{
    public Guid Id { get; set; }
    public Guid BankGatewayGroupId { get; set; }
    public string BankGatewayGroupTitle { get; set; } = string.Empty;

    public Guid BankGatewayId { get; set; }
    public string ShebaNumber { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string AccountTitle { get; set; } = string.Empty;
}
