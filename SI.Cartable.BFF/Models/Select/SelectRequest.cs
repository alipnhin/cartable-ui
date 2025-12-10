namespace SI.Cartable.BFF.Models.Select
{
    public class SelectRequest
    {
        public string searchTerm { get; set; } = string.Empty;
        public int pageSize { get; set; } = 10;
        public int pageNum { get; set; } = 1;
    }
}
