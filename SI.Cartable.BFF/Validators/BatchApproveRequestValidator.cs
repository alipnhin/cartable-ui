using FluentValidation;
using SI.Cartable.BFF.Models.Cartable;

namespace SI.Cartable.BFF.Validators;

public class BatchApproveRequestValidator : AbstractValidator<BatchApproveRequest>
{
    public BatchApproveRequestValidator()
    {
        RuleFor(x => x.ObjectIds)
            .NotEmpty()
            .WithMessage("لیست شناسه‌های موجودیت نمی‌تواند خالی باشد")
            .Must(x => x.Count > 0)
            .WithMessage("حداقل یک شناسه موجودیت باید ارسال شود")
            .Must(x => x.Count <= 100)
            .WithMessage("حداکثر 100 موجودیت در هر درخواست مجاز است");

        RuleFor(x => x.OperationType)
            .IsInEnum()
            .WithMessage("نوع عملیات معتبر نیست");

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
