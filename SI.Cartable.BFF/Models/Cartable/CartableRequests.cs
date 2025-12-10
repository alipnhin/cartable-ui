using SI.Cartable.BFF.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace SI.Cartable.BFF.Models.Cartable;

public class SendOperationOtpRequest
{
    public Guid ObjectId { get; set; }
    public OperationTypeEnum Operation { get; set; }
}

public class ApproveRequest
{
    [Display(Name = "عملیات")]
    [Required(ErrorMessage = "عملیات نامعتبر است")]
    public OperationTypeEnum? OperationType { get; set; }

    public Guid WithdrawalOrderId { get; set; }

    public string OtpCode { get; set; } = string.Empty;
}

public class SendBatchOperationOtpRequest
{
    public List<Guid> ObjectIds { get; set; }
    public OperationTypeEnum Operation { get; set; }
}

public class BatchApproveRequest
{
    public List<Guid> ObjectIds { get; set; } = new();
    public OperationTypeEnum OperationType { get; set; }
    public string OtpCode { get; set; } = string.Empty;
}
