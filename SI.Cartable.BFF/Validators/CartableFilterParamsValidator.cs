using FluentValidation;
using SI.Cartable.BFF.Models.PaymentOrders;

namespace SI.Cartable.BFF.Validators;

public class CartableFilterParamsValidator : AbstractValidator<CartableFilterParams>
{
    public CartableFilterParamsValidator()
    {
        Include(new PaginationParamsValidator());

        RuleFor(x => x.TrackingId)
            .MaximumLength(50)
            .WithMessage("طول شناسه پیگیری نمی‌تواند بیشتر از 50 کاراکتر باشد");

        RuleFor(x => x.OrderId)
            .MaximumLength(50)
            .WithMessage("طول شناسه سفارش نمی‌تواند بیشتر از 50 کاراکتر باشد");

        RuleFor(x => x.Name)
            .MaximumLength(200)
            .WithMessage("طول نام نمی‌تواند بیشتر از 200 کاراکتر باشد");

        RuleFor(x => x.SourceIban)
            .MaximumLength(26)
            .WithMessage("طول شبا نمی‌تواند بیشتر از 26 کاراکتر باشد")
            .Must(BeValidIbanFormat)
            .When(x => !string.IsNullOrEmpty(x.SourceIban))
            .WithMessage("فرمت شبا معتبر نیست");

        RuleFor(x => x.ToDate)
            .GreaterThanOrEqualTo(x => x.FromDate)
            .When(x => x.FromDate.HasValue && x.ToDate.HasValue)
            .WithMessage("تاریخ پایان باید بزرگتر یا مساوی تاریخ شروع باشد");
    }

    private bool BeValidIbanFormat(string iban)
    {
        if (string.IsNullOrWhiteSpace(iban))
            return true;

        // Remove spaces and convert to uppercase
        iban = iban.Replace(" ", "").ToUpper();

        // Iranian IBAN should start with IR and be 26 characters
        return iban.StartsWith("IR") && iban.Length == 26 && iban.Substring(2).All(char.IsDigit);
    }
}
