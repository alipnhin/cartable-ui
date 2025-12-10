using System.ComponentModel.DataAnnotations;

namespace SI.Cartable.BFF.Models.Enums
{
    public enum BankGatewayUserStatusEnum
    {
        [Display(Name = "درخواست تائید فعالسازی")]
        EnableRequested = 0,

        [Display(Name = "فعال")]
        Enable = 1,

        [Display(Name = "غیرفعال")]
        Disable = 2,

        [Display(Name = "درخواست تائید غیرفعالسازی")]
        DisableRequested = 3,

        [Display(Name = "رد شده")]
        Rejected = 4
    }
}
