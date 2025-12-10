using System.ComponentModel.DataAnnotations;

namespace SI.Cartable.BFF.Models.Enums;

public enum OperationTypeEnum
{
    [Display(Name = "")]
    None = 0,

    [Display(Name = "تائید درخواست پرداخت")]
    ApproveCartablePayment = 1,

    [Display(Name = "رد درخواست پرداخت")]
    RejectCartablePayment = 2,

    [Display(Name = "فعال کردن امضادار")]
    EnableGatewayUser = 3,

    [Display(Name = "غیرفعال کردن امضادار")]
    DisableGatewayUser = 4,

    [Display(Name = "رد درخواست امضادار")]
    RejectGatewayUser = 5

}
