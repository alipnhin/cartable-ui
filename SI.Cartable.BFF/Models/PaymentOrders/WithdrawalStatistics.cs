using SI.Cartable.BFF.Models.Enums;

namespace SI.Cartable.BFF.Models.PaymentOrders;

public class TransactionStatisticsResponseDto
{
    public Guid WithdrawalOrderId { get; set; }
    public int TotalTransactions { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal SuccessfulAmount { get; set; }
    public decimal FailedAmount { get; set; }
    public decimal OverallSuccessRate { get; set; }
    public StatusStatisticsDto StatusStatistics { get; set; } = new();
    public PaymentTypeStatisticsDto PaymentTypeStatistics { get; set; } = new();
    public ReasonCodeStatisticsDto ReasonCodeStatistics { get; set; } = new();
    public FinancialStatisticsDto FinancialStatistics { get; set; } = new();
    public TimeStatisticsDto TimeStatistics { get; set; } = new();
}

public class StatusStatisticsDto
{
    public List<StatusBreakdownDto> Breakdown { get; set; } = new();
    public decimal SuccessRate { get; set; }
    public decimal FailureRate { get; set; }
}

public class StatusBreakdownDto
{
    public PaymentItemStatusEnum Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Percentage { get; set; }
    public decimal Amount { get; set; }
}

public class PaymentTypeStatisticsDto
{
    public List<PaymentTypeBreakdownDto> Breakdown { get; set; } = new();
    public PaymentMethodEnum MostUsedType { get; set; }
    public decimal MostUsedTypePercentage { get; set; }
}

public class PaymentTypeBreakdownDto
{
    public PaymentMethodEnum PaymentType { get; set; }
    public string TypeName { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Percentage { get; set; }
    public decimal Amount { get; set; }
    public decimal SuccessRate { get; set; }
    public decimal AverageAmount { get; set; }
}

public class ReasonCodeStatisticsDto
{
    public List<ReasonCodeBreakdownDto> Breakdown { get; set; } = new();
    public TransactionReasonEnum MostUsedReason { get; set; }
    public decimal MostUsedReasonPercentage { get; set; }
}

public class ReasonCodeBreakdownDto
{
    public TransactionReasonEnum ReasonCode { get; set; }
    public string ReasonName { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Percentage { get; set; }
    public decimal Amount { get; set; }
    public decimal SuccessRate { get; set; }
}

public class FinancialStatisticsDto
{
    public decimal TotalAmount { get; set; }
    public decimal SuccessfulAmount { get; set; }
    public decimal FailedAmount { get; set; }
    public decimal PendingAmount { get; set; }
    public decimal AverageAmount { get; set; }
    public decimal MinAmount { get; set; }
    public decimal MaxAmount { get; set; }
    public decimal MedianAmount { get; set; }
}

public class TimeStatisticsDto
{
    public DateTimeOffset? EarliestTransaction { get; set; }
    public DateTimeOffset? LatestTransaction { get; set; }
    public DateTimeOffset? LastUpdate { get; set; }
    public double? AverageProcessingTimeMinutes { get; set; }
    public List<HourlyDistributionDto> HourlyDistribution { get; set; } = new();
}

public class HourlyDistributionDto
{
    public int Hour { get; set; }
    public int Count { get; set; }
    public decimal Percentage { get; set; }
}

// Combined Matrix Statistics
public class StatusPaymentTypeMatrixDto
{
    public List<MatrixCellDto> Matrix { get; set; } = new();
}

public class MatrixCellDto
{
    public PaymentItemStatusEnum Status { get; set; }
    public PaymentMethodEnum PaymentType { get; set; }
    public int Count { get; set; }
    public decimal Amount { get; set; }
    public decimal Percentage { get; set; }
}

// Lightweight DTOs for basic statistics
public class BasicTransactionStatisticsDto
{
    public int TotalCount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal SuccessRate { get; set; }
    public int SuccessfulCount { get; set; }
    public int FailedCount { get; set; }
    public int PendingCount { get; set; }
}

public class QuickStatusStatsDto
{
    public PaymentItemStatusEnum Status { get; set; }
    public int Count { get; set; }
    public decimal Percentage { get; set; }
}
