using FluentValidation;
using SI.Cartable.BFF.Models.PaymentOrders;

namespace SI.Cartable.BFF.Validators;

public class TransactionFilterParamsValidator : AbstractValidator<TransactionFilterParams>
{
    public TransactionFilterParamsValidator()
    {
        Include(new PaginationParamsValidator());

        RuleFor(x => x.WithdrawalOrderId)
            .NotEmpty()
            .WithMessage("شناسه سفارش برداشت الزامی است");

        RuleFor(x => x.SerchValue)
            .MaximumLength(200)
            .WithMessage("طول مقدار جستجو نمی‌تواند بیشتر از 200 کاراکتر باشد");
    }
}
