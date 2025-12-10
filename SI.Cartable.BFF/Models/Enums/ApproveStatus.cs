using System.ComponentModel.DataAnnotations;

namespace SI.Cartable.BFF.Models.Enums
{
    public enum ApproveStatus
    {

        /// <summary> در انتظار تائید</summary>
        [Display(Name = "در انتظار تائید")]
        WaitForAction = 0,

        /// <summary> تائید شده</summary>
        [Display(Name = "تائید شده")]
        Accepted = 1,

        /// <summary> رد شده</summary>
        [Display(Name = "رد شده")]
        Rejected = 2
    }
}
