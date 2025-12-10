namespace SI.Cartable.BFF.Models.Common;

public class PagedListResponse<TEntity>
{
    public List<TEntity> Items { get; set; }
   public int PageNumber { get; set; }
   public int PageSize { get; set; }
   public long TotalPageCount { get; set; }
   public long TotalItemCount { get; set; }
   public bool HasNextPage { get; set; }
   public bool HasPreviousPage { get; set; }
   public bool IsFirstPage { get; set; }
   public bool IsLastPage { get; set; }
   public long FirstItemOnPage { get; set; }
    public long LastItemOnPage { get; set; }
}
