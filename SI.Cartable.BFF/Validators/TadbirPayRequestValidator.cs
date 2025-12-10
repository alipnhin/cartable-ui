using FluentValidation;
using SI.Cartable.BFF.Models;

namespace SI.Cartable.BFF.Validators;

public class TadbirPayRequestValidator : AbstractValidator<TadbirPayRequest>
{
    public TadbirPayRequestValidator()
    {
        RuleFor(x => x.Endpoint)
            .NotEmpty()
            .WithMessage("آدرس endpoint الزامی است")
            .MaximumLength(500)
            .WithMessage("طول آدرس endpoint نمی‌تواند بیشتر از 500 کاراکتر باشد")
            .Must(BeValidEndpoint)
            .WithMessage("آدرس endpoint معتبر نیست");
    }

    private bool BeValidEndpoint(string endpoint)
    {
        if (string.IsNullOrWhiteSpace(endpoint))
            return false;

        // Endpoint should start with / or be a valid relative path
        return endpoint.StartsWith("/") ||
               (!endpoint.Contains("://") && !endpoint.Contains(".."));
    }
}
