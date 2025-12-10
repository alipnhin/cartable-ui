namespace SI.Cartable.BFF.Models.Dashboard;

public class DashboardFilterParams
{
    public Guid? AccountGroupId { get; set; }
    public Guid? BankGatewayId { get; set; }
    public DateTimeOffset? FromDate { get; set; }
    public DateTimeOffset? ToDate { get; set; }
}
