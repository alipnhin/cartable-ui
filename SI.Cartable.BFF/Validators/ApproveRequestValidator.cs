using FluentValidation;
using SI.Cartable.BFF.Models.Cartable;

namespace SI.Cartable.BFF.Validators;

public class ApproveRequestValidator : AbstractValidator<ApproveRequest>
{
    public ApproveRequestValidator()
    {
        RuleFor(x => x.OperationType)
            .NotNull()
            .WithMessage("نوع عملیات الزامی است")
            .IsInEnum()
            .WithMessage("نوع عملیات معتبر نیست");

        RuleFor(x => x.WithdrawalOrderId)
            .NotEmpty()
            .WithMessage("شناسه دستور برداشت الزامی است");

        RuleFor(x => x.OtpCode)
            .NotEmpty()
            .WithMessage("کد OTP الزامی است")
            .Length(4, 6)
            .WithMessage("کد OTP باید بین 4 تا 6 کاراکتر باشد")
            .Must(BeNumeric)
            .WithMessage("کد OTP فقط باید شامل اعداد باشد");
    }

    private bool BeNumeric(string otpCode)
    {
        return !string.IsNullOrWhiteSpace(otpCode) && otpCode.All(char.IsDigit);
    }
}
