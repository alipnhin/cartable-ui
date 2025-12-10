using System.ComponentModel.DataAnnotations;

namespace SI.Cartable.BFF.Models.Enums
{
    public enum PaymentMethodEnum
    {
        /// <summary>
        /// نامشخص
        /// </summary>
        [Display(Name = "نامشخص")]
        Unknown = -1,
        /// <summary>
        /// داخلی
        /// </summary>

        [Display(Name = "داخلی")]
        Internal = 0,

        /// <summary>
        /// پایا
        /// </summary>
        [Display(Name = "پایا")]
        Paya = 1,

        /// <summary>
        /// ساتنا
        /// </summary>

        [Display(Name = "ساتنا")]
        Satna = 2,

        /// <summary>
        /// کارت به کارت
        /// </summary>

        [Display(Name = "کارت به کارت")]
        Card = 3
    }
}
