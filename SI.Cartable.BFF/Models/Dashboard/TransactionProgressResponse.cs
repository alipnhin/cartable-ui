using SI.Cartable.BFF.Models.Enums;

namespace SI.Cartable.BFF.Models.Dashboard;

public class TransactionStatusSummary
{
    public PaymentItemStatusEnum Status { get; set; }
    public string StatusTitle { get; set; } = string.Empty;
    public int TransactionCount { get; set; }
    public long TotalAmount { get; set; }

    public double Percent { get; set; }
}

public class PaymentTypeSummary
{
    public PaymentMethodEnum PaymentType { get; set; }

    public string PaymentTypeTitle { get; set; } = string.Empty;

    public int Count { get; set; }
    public long TotalAmount { get; set; }
}

public class TransactionProgressResponse
{
    public int TotalTransactions { get; set; }
    public long TotalAmount { get; set; }
    public int SucceededTransactions { get; set; }
    public long SucceededAmount { get; set; }
    public double SuccessPercent { get; set; }

    public int PendingTransactions { get; set; }
    public long PendingAmount { get; set; }
    public double PendingPercent { get; set; }


    public int FailedTransactions { get; set; }
    public long FailedAmount { get; set; }
    public double FailedPercent { get; set; }


    public int ClosedWithdrawalOrders { get; set; }
    public List<TransactionStatusSummary> TransactionStatusSummary { get; set; } = new();
    public List<PaymentTypeSummary> PaymentTypeSummary { get; set; } = new();
}
