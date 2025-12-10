using FluentValidation;
using SI.Cartable.BFF.Models.Select;

namespace SI.Cartable.BFF.Validators;

public class SelectRequestValidator : AbstractValidator<SelectRequest>
{
    public SelectRequestValidator()
    {
        RuleFor(x => x.searchTerm)
            .MaximumLength(200)
            .WithMessage("طول عبارت جستجو نمی‌تواند بیشتر از 200 کاراکتر باشد");

        RuleFor(x => x.pageSize)
            .InclusiveBetween(1, 100)
            .WithMessage("اندازه صفحه باید بین 1 تا 100 باشد");

        RuleFor(x => x.pageNum)
            .GreaterThan(0)
            .WithMessage("شماره صفحه باید بزرگتر از 0 باشد");
    }
}
