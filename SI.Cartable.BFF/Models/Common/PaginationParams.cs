namespace SI.Cartable.BFF.Models.Common;

public class PaginationParams
{
    public PaginationParams()
    {
        PageNumber = 1;
        PageSize = 10;
    }

    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public string OrderBy { get; set; } = "Id asc";
}
