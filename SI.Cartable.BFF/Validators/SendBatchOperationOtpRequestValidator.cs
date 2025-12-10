using FluentValidation;
using SI.Cartable.BFF.Models.Cartable;

namespace SI.Cartable.BFF.Validators;

public class SendBatchOperationOtpRequestValidator : AbstractValidator<SendBatchOperationOtpRequest>
{
    public SendBatchOperationOtpRequestValidator()
    {
        RuleFor(x => x.ObjectIds)
            .NotEmpty()
            .WithMessage("لیست شناسه‌های موجودیت نمی‌تواند خالی باشد")
            .Must(x => x.Count > 0)
            .WithMessage("حداقل یک شناسه موجودیت باید ارسال شود")
            .Must(x => x.Count <= 100)
            .WithMessage("حداکثر 100 موجودیت در هر درخواست مجاز است");

        RuleFor(x => x.Operation)
            .IsInEnum()
            .WithMessage("نوع عملیات معتبر نیست");
    }
}
