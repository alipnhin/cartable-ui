namespace SI.Cartable.BFF.Models.Accounts;

public class ChangeMinimumSignatureRequest
{
    public int MinimumSignature { get; set; }
    public string BankGatewayId { get; set; } = string.Empty;
}

public class AddSignerRequest
{
    public string UserId { get; set; } = string.Empty;
    public string BankGatewayId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
}

public class UserSelectItem
{
    public string Id { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
}
