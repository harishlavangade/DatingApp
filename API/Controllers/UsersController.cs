using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        //private readonly DataContext _context;
        // public UsersController(DataContext context)
        // {
        //     _context = context;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        // }
        //Repository Controller
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            // _context = context;

        }



        //[HttpGet]
        // public ActionResult<IEnumerable<AppUser>> GetUsers()
        // {
        //     return  _context.Users.ToList();    
        // }
        // [AllowAnonymous]
        // public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        // {
        //     return await _context.Users.ToListAsync();
        // }
        //Below Repository Pattern
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            //var user = await _userRepository.GetUsersAsync();
            //return Ok(user);
            //Short hand code.
            // var users = await _userRepository.GetUsersAsync();
            // var userToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            // return Ok(userToReturn);

            var users = await _userRepository.GetMembersAsync();
            return Ok(users);
        }
        //api/users/2
        // [Authorize]
        //[HttpGet("{id}")]
        // public ActionResult<AppUser> GetUser(int id)
        // {
        //     return _context.Users.Find(id);
        // }
        // public async Task<ActionResult<AppUser>> GetUser(int id)
        // {
        //     return await _context.Users.FindAsync(id);
        // }
        // [HttpGet("{id}")]
        // public async Task<ActionResult<AppUser>> GetUser(int id)
        // {
        //     return Ok(await _userRepository.GetUserByIdAsync(id));
        // }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            //var user = await _userRepository.GetUserByUserNameAsync(username);
            return  await _userRepository.GetMemberAsync(username);
            //return _mapper.Map<MemberDto>(user);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username= memberUpdateDto.username; //User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _userRepository.GetUserByUserNameAsync(username);
            //automapper mapp the property
            _mapper.Map(memberUpdateDto,user);

            _userRepository.Update(user);

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Fail to update user");

        }

    }
}