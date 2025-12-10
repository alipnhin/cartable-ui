using FluentValidation;
using SI.Cartable.BFF.Models.Transactions;

namespace SI.Cartable.BFF.Validators;

public class TransactionsRequestValidator : AbstractValidator<TransactionsRequest>
{
    public TransactionsRequestValidator()
    {
        Include(new PaginationParamsValidator());

        RuleFor(x => x.NationalCode)
            .MaximumLength(10)
            .WithMessage("طول کد ملی نمی‌تواند بیشتر از 10 کاراکتر باشد")
            .Must(BeValidNationalCode)
            .When(x => !string.IsNullOrEmpty(x.NationalCode))
            .WithMessage("کد ملی معتبر نیست");

        RuleFor(x => x.DestinationIban)
            .MaximumLength(26)
            .WithMessage("طول شبا مقصد نمی‌تواند بیشتر از 26 کاراکتر باشد")
            .Must(BeValidIbanFormat)
            .When(x => !string.IsNullOrEmpty(x.DestinationIban))
            .WithMessage("فرمت شبا معتبر نیست");

        RuleFor(x => x.AccountNumber)
            .MaximumLength(50)
            .WithMessage("طول شماره حساب نمی‌تواند بیشتر از 50 کاراکتر باشد");

        RuleFor(x => x.OrderId)
            .MaximumLength(50)
            .WithMessage("طول شناسه سفارش نمی‌تواند بیشتر از 50 کاراکتر باشد");
    }

    private bool BeValidNationalCode(string? nationalCode)
    {
        if (string.IsNullOrWhiteSpace(nationalCode))
            return true;

        nationalCode = nationalCode.Trim();

        // National code should be exactly 10 digits
        if (nationalCode.Length != 10 || !nationalCode.All(char.IsDigit))
            return false;

        // Validate checksum
        var check = int.Parse(nationalCode.Substring(9, 1));
        var sum = 0;
        for (int i = 0; i < 9; i++)
        {
            sum += int.Parse(nationalCode.Substring(i, 1)) * (10 - i);
        }
        var mod = sum % 11;
        return (mod < 2 && check == mod) || (mod >= 2 && check == 11 - mod);
    }

    private bool BeValidIbanFormat(string? iban)
    {
        if (string.IsNullOrWhiteSpace(iban))
            return true;

        // Remove spaces and convert to uppercase
        iban = iban.Replace(" ", "").ToUpper();

        // Iranian IBAN should start with IR and be 26 characters
        return iban.StartsWith("IR") && iban.Length == 26 && iban.Substring(2).All(char.IsDigit);
    }
}
