using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        public DataContext _context { get; }

        public BuggyController(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return "secret Text";
        }

         [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var thing = _context.Users.Find(-1);
            if(thing == null) return NotFound();

            return Ok(thing);
        }

         [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
        //    try
        //    {
            var thing = _context.Users.Find(-1);

            var thingToReturn = thing.ToString();

            return thingToReturn;
        //    }
        //    catch (System.Exception ex)
        //    {
        //        return StatusCode(500,"Computer Say no client");
        //    }     
        }

         [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("This is bad request");
        }
       
    }
}