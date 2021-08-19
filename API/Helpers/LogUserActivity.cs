using System;
using System.Threading.Tasks;
using API.Extension;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            if(!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var username = resultContext.HttpContext.User.GetUsername();

            var resp = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();
           
           var user = await resp.GetUserByUserNameAsync(username);
           user.LastActive = DateTime.Now;

           await resp.SaveAllAsync();
        }
    }
}