using FluentValidation;
using SI.Cartable.BFF.Models.Dashboard;

namespace SI.Cartable.BFF.Validators;

public class DashboardFilterParamsValidator : AbstractValidator<DashboardFilterParams>
{
    public DashboardFilterParamsValidator()
    {
        RuleFor(x => x.ToDate)
            .GreaterThanOrEqualTo(x => x.FromDate)
            .When(x => x.FromDate.HasValue && x.ToDate.HasValue)
            .WithMessage("تاریخ پایان باید بزرگتر یا مساوی تاریخ شروع باشد");

        RuleFor(x => x.FromDate)
            .LessThanOrEqualTo(DateTimeOffset.UtcNow)
            .When(x => x.FromDate.HasValue)
            .WithMessage("تاریخ شروع نمی‌تواند در آینده باشد");

        RuleFor(x => x.ToDate)
            .LessThanOrEqualTo(DateTimeOffset.UtcNow)
            .When(x => x.ToDate.HasValue)
            .WithMessage("تاریخ پایان نمی‌تواند در آینده باشد");
    }
}
