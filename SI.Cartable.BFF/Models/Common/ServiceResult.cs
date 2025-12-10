using Microsoft.AspNetCore.Http;

namespace SI.Cartable.BFF.Models.Common;

/// <summary>
/// Base abstract class for all service results
/// </summary>
public abstract class ServiceResultBase
{
    /// <summary>
    /// Indicates whether the operation was successful
    /// </summary>
    public bool IsSuccess { get; protected set; }

    /// <summary>
    /// Indicates whether the operation failed
    /// </summary>
    public bool IsFailure => !IsSuccess;

    /// <summary>
    /// Message associated with the result (success or failure)
    /// </summary>
    public string Message { get; protected set; }

    /// <summary>
    /// HTTP Status Code for the result (default: 400 for failure, 200 for success)
    /// </summary>
    public int StatusCode { get; protected set; }

    /// <summary>
    /// Protected constructor to initialize the base result
    /// </summary>
    protected ServiceResultBase(bool isSuccess, string message = null, int? statusCode = null)
    {
        IsSuccess = isSuccess;
        Message = message;
        StatusCode = statusCode ?? (isSuccess ? StatusCodes.Status200OK : StatusCodes.Status400BadRequest);
    }

    /// <summary>
    /// Throws an InvalidOperationException if the operation failed
    /// Useful for fluent API usage
    /// </summary>
    public ServiceResultBase ThrowIfFailure()
    {
        if (IsFailure)
            throw new InvalidOperationException(Message ?? "Operation failed.");
        return this;
    }
}

/// <summary>
/// Non-generic service result
/// </summary>
public sealed class ServiceResult : ServiceResultBase
{
    private ServiceResult(bool isSuccess, string message = null, int? statusCode = null)
        : base(isSuccess, message, statusCode) { }

    /// <summary>
    /// Creates a successful result
    /// </summary>
    public static ServiceResult Success(string message = null, int statusCode = StatusCodes.Status200OK)
        => new ServiceResult(true, message, statusCode);

    /// <summary>
    /// Creates a failed result with BadRequest (400) status code
    /// </summary>
    public static ServiceResult Fail(string message, int statusCode = StatusCodes.Status400BadRequest)
        => new ServiceResult(false, message, statusCode);

    /// <summary>
    /// Creates a NotFound (404) result
    /// </summary>
    public static ServiceResult NotFound(string message = "منبع مورد نظر یافت نشد.")
        => new ServiceResult(false, message, StatusCodes.Status404NotFound);

    /// <summary>
    /// Creates a Forbidden (403) result
    /// </summary>
    public static ServiceResult Forbidden(string message = "شما به این منبع دسترسی ندارید.")
        => new ServiceResult(false, message, StatusCodes.Status403Forbidden);

    /// <summary>
    /// Creates a Conflict (409) result
    /// </summary>
    public static ServiceResult Conflict(string message = "تداخل در داده‌ها وجود دارد.")
        => new ServiceResult(false, message, StatusCodes.Status409Conflict);

    /// <summary>
    /// Creates an Unauthorized (401) result
    /// </summary>
    public static ServiceResult Unauthorized(string message = "احراز هویت انجام نشده است.")
        => new ServiceResult(false, message, StatusCodes.Status401Unauthorized);
}

/// <summary>
/// Generic service result for returning data
/// </summary>
public sealed class ServiceResult<T> : ServiceResultBase
{
    /// <summary>
    /// The data returned by the operation
    /// </summary>
    public T Data { get; private set; }

    private ServiceResult(bool isSuccess, T data = default, string message = null, int? statusCode = null)
        : base(isSuccess, message, statusCode)
    {
        Data = data;
    }

    /// <summary>
    /// Creates a successful result with data
    /// </summary>
    public static ServiceResult<T> Success(T data, string message = null, int statusCode = StatusCodes.Status200OK)
        => new ServiceResult<T>(true, data, message, statusCode);

    /// <summary>
    /// Creates a failed result with BadRequest (400) status code
    /// </summary>
    public static ServiceResult<T> Fail(string message, int statusCode = StatusCodes.Status400BadRequest)
        => new ServiceResult<T>(false, default, message, statusCode);

    /// <summary>
    /// Creates a NotFound (404) result
    /// </summary>
    public static ServiceResult<T> NotFound(string message = "منبع مورد نظر یافت نشد.")
        => new ServiceResult<T>(false, default, message, StatusCodes.Status404NotFound);

    /// <summary>
    /// Creates a Forbidden (403) result
    /// </summary>
    public static ServiceResult<T> Forbidden(string message = "شما به این منبع دسترسی ندارید.")
        => new ServiceResult<T>(false, default, message, StatusCodes.Status403Forbidden);

    /// <summary>
    /// Creates a Conflict (409) result
    /// </summary>
    public static ServiceResult<T> Conflict(string message = "تداخل در داده‌ها وجود دارد.")
        => new ServiceResult<T>(false, default, message, StatusCodes.Status409Conflict);

    /// <summary>
    /// Creates an Unauthorized (401) result
    /// </summary>
    public static ServiceResult<T> Unauthorized(string message = "احراز هویت انجام نشده است.")
        => new ServiceResult<T>(false, default, message, StatusCodes.Status401Unauthorized);

    /// <summary>
    /// Maps the data to a new type while keeping the result status, message, and status code
    /// </summary>
    public ServiceResult<TResult> Map<TResult>(Func<T, TResult> mapFunc)
    {
        if (IsFailure)
            return new ServiceResult<TResult>(false, default, Message, StatusCode);

        return new ServiceResult<TResult>(true, mapFunc(Data), Message, StatusCode);
    }
}
