using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SI.Cartable.BFF.Models.Common;

namespace SI.Cartable.BFF.Controllers;

[ApiController]
[Authorize]
public abstract class BaseController : ControllerBase
{
    protected string ExtractToken(string authorization)
    {
        return authorization?.Replace("Bearer ", "") ?? string.Empty;
    }

    /// <summary>
    /// Converts ServiceResult to appropriate IActionResult based on StatusCode
    /// </summary>
    /// <param name="result">The service result</param>
    /// <returns>Appropriate IActionResult (Ok, BadRequest, NotFound, Forbid, etc.)</returns>
    protected IActionResult ToActionResult(ServiceResult result)
    {
        if (result.IsSuccess)
        {
            return result.StatusCode switch
            {
                StatusCodes.Status200OK => Ok(result.Message),
                StatusCodes.Status201Created => Created(string.Empty, result.Message),
                StatusCodes.Status202Accepted => StatusCode(StatusCodes.Status202Accepted, result.Message),
                StatusCodes.Status204NoContent => NoContent(),
                _ => StatusCode(result.StatusCode, result.Message)
            };
        }
        return result.StatusCode switch
        {
            StatusCodes.Status400BadRequest => BadRequest(result.Message),
            StatusCodes.Status401Unauthorized => Unauthorized(result.Message),
            StatusCodes.Status403Forbidden => Forbid(),
            StatusCodes.Status404NotFound => NotFound(result.Message),
            StatusCodes.Status409Conflict => Conflict(result.Message),
            _ => StatusCode(result.StatusCode, result.Message)
        };
    }

    /// <summary>
    /// Converts ServiceResult with data to appropriate IActionResult based on StatusCode
    /// </summary>
    /// <typeparam name="T">Type of data</typeparam>
    /// <param name="result">The service result with data</param>
    /// <returns>Appropriate IActionResult with data</returns>
    protected IActionResult ToActionResult<T>(ServiceResult<T> result)
    {
        if (result.IsSuccess)
        {
            return result.StatusCode switch
            {
                StatusCodes.Status200OK => Ok(result.Data),
                StatusCodes.Status201Created => StatusCode(StatusCodes.Status201Created, result.Data),
                StatusCodes.Status202Accepted => StatusCode(StatusCodes.Status202Accepted, result.Data),
                StatusCodes.Status204NoContent => NoContent(),
                _ => StatusCode(result.StatusCode, result.Data)
            };
        }
        return result.StatusCode switch
        {
            StatusCodes.Status400BadRequest => BadRequest(result.Message),
            StatusCodes.Status401Unauthorized => Unauthorized(result.Message),
            StatusCodes.Status403Forbidden => Forbid(),
            StatusCodes.Status404NotFound => NotFound(result.Message),
            StatusCodes.Status409Conflict => Conflict(result.Message),
            _ => StatusCode(result.StatusCode, result.Message)
        };
    }

    /// <summary>
    /// Converts ServiceResult with data to appropriate IActionResult with custom success status code
    /// Useful for Created (201) or Accepted (202) responses
    /// </summary>
    /// <typeparam name="T">Type of data</typeparam>
    /// <param name="result">The service result with data</param>
    /// <param name="successStatusCode">Custom status code for success (e.g., 201, 202)</param>
    /// <returns>Appropriate IActionResult with data</returns>
    protected IActionResult ToActionResult<T>(ServiceResult<T> result, int successStatusCode)
    {
        if (result.IsSuccess)
        {
            return successStatusCode switch
            {
                StatusCodes.Status201Created => StatusCode(StatusCodes.Status201Created, result.Data),
                StatusCodes.Status202Accepted => StatusCode(StatusCodes.Status202Accepted, result.Data),
                StatusCodes.Status204NoContent => NoContent(),
                _ => StatusCode(successStatusCode, result.Data)
            };
        }
        return ToActionResult(result);
    }
}
