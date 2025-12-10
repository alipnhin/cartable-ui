using FluentValidation;
using SI.Cartable.BFF.Models.Common;

namespace SI.Cartable.BFF.Validators;

public class PaginationParamsValidator : AbstractValidator<PaginationParams>
{
    public PaginationParamsValidator()
    {
        RuleFor(x => x.PageNumber)
            .GreaterThan(0)
            .WithMessage("شماره صفحه باید بزرگتر از 0 باشد");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 100)
            .WithMessage("اندازه صفحه باید بین 1 تا 100 باشد");

        RuleFor(x => x.OrderBy)
            .NotEmpty()
            .WithMessage("فیلد مرتب‌سازی نمی‌تواند خالی باشد")
            .MaximumLength(100)
            .WithMessage("طول فیلد مرتب‌سازی نمی‌تواند بیشتر از 100 کاراکتر باشد");
    }
}
