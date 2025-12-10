using FluentValidation;
using SI.Cartable.BFF.Models.Cartable;

namespace SI.Cartable.BFF.Validators;

public class SendOperationOtpRequestValidator : AbstractValidator<SendOperationOtpRequest>
{
    public SendOperationOtpRequestValidator()
    {
        RuleFor(x => x.ObjectId)
            .NotEmpty()
            .WithMessage("شناسه موجودیت الزامی است");

        RuleFor(x => x.Operation)
            .IsInEnum()
            .WithMessage("نوع عملیات معتبر نیست");
    }
}
