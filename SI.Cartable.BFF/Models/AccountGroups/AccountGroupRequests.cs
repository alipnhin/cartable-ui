using SI.Cartable.BFF.Models.Common;

namespace SI.Cartable.BFF.Models.AccountGroups;

public class FilterAccountGroupsParams : PaginationParams
{
    public string Title { get; set; } = string.Empty;
    public bool? IsEnable { get; set; }
}

public class CreateAccountGroupParams
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public bool IsEnable { get; set; }
}

public class EditAccountGroupParams
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public bool IsEnable { get; set; }
}

public class ChangeAccountGroupStatusParams
{
    public Guid BankGatewayGroupId { get; set; }
    public bool Status { get; set; }
}

public class AddGroupAccountsParams
{
    public Guid GroupId { get; set; }

    public List<Guid> BankGatewayIds { get; set; }
}
