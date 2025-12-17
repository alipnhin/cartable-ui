using FluentValidation;
using SI.Cartable.BFF.Models.Dashboard;

namespace SI.Cartable.BFF.Validators;

public class DashboardFilterParamsValidator : AbstractValidator<DashboardFilterParams>
{
    public DashboardFilterParamsValidator()
    {
        RuleFor(x => x)
            .Must(HaveValidDateRange)
            .When(x => x.FromDate.HasValue && x.ToDate.HasValue)
            .WithMessage("تاریخ پایان باید بزرگتر یا مساوی تاریخ شروع باشد")
            .OverridePropertyName(nameof(DashboardFilterParams.ToDate));
    }

    private static bool HaveValidDateRange(DashboardFilterParams model)
    {
        return model.ToDate!.Value >= model.FromDate!.Value;
    }
}
