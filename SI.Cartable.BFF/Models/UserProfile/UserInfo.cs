namespace SI.Cartable.BFF.Models.UserProfile;

public class UserInfoResponse
{
    public string Sub { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? GivenName { get; set; }
    public string? FamilyName { get; set; }
    public string? PreferredUsername { get; set; }
    public string? Email { get; set; }
    public bool? EmailVerified { get; set; }
    public string? PhoneNumber { get; set; }
    public bool? PhoneNumberVerified { get; set; }
    public string? Picture { get; set; }
    public object? Role { get; set; } // Can be string or string[]
    public string? NationalCode { get; set; }
}
