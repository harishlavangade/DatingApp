using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extension;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    //[Authorize]
    public class UsersController : BaseApiController
    {
        //private readonly DataContext _context;
        // public UsersController(DataContext context)
        // {
        //     _context = context;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public IPhotoService PhotoService { get; set; }

        // }
        //Repository Controller
        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            PhotoService = photoService;
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
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
        {
            //var user = await _userRepository.GetUsersAsync();
            //return Ok(user);
            //Short hand code.
            // var users = await _userRepository.GetUsersAsync();
            // var userToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            // return Ok(userToReturn);
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUsername());
            userParams.CurrentUserName = user.UserName;

            if(string.IsNullOrEmpty(userParams.Gender))
            userParams.Gender = user.Gender == "male" ? "female":"male";

            var users = await _userRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(users.CurrentPage,users.PageSize,users.TotalCount
            ,users.TotalPages);

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
            return await _userRepository.GetMemberAsync(username);
            //return _mapper.Map<MemberDto>(user);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.GetUsername();
            //memberUpdateDto.username; //User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _userRepository.GetUserByUserNameAsync(username);
            //automapper mapp the property
            _mapper.Map(memberUpdateDto, user);

            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Fail to update user");

        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUsername());

            var result = await PhotoService.AddPhotoAsync(file);

            if(result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }
            user.Photos.Add(photo);

            if(await _userRepository.SaveAllAsync())
                return _mapper.Map<PhotoDto>(photo);
            return BadRequest("Problem adding photo");


        }
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x=>x.Id==photoId);

            if(photo.IsMain) return BadRequest("This is already your main photo");

            var currentMain  = user.Photos.FirstOrDefault(x=>x.IsMain);
            if(currentMain != null) currentMain.IsMain= false;
            photo.IsMain = true;
            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo");


        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if(photo == null) return NotFound();

            if(photo.IsMain) return BadRequest("You cannot delete your main photo");

            if(photo.PublicId != null)
            {
                var result = await PhotoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error != null) return BadRequest(result.Error.Message);
            } 

            user.Photos.Remove(photo);
            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete photo");


        }

    }
}