using System.Threading.Tasks;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Extension;
using System.Collections.Generic;
using API.DTOs;

namespace API.Controllers
{
    [Authorize]
    public class LikesControllers : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly ILikesRepository _likesRespository;

        public LikesControllers(IUserRepository userRepository,ILikesRepository likesRespository)
        {
            this._userRepository = userRepository;
            this._likesRespository = likesRespository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUsername();

            var LikedUser =await _userRepository.GetUserByUserNameAsync(username);

            var SourceUser = await _likesRespository.GetUserWithLikes(int.Parse(sourceUserId));

            if(LikedUser == null) return NotFound();

            if(SourceUser.UserName == username) return BadRequest("You cannot like self");

            var userLike= await _likesRespository.GetUserLike(int.Parse(sourceUserId), LikedUser.Id);

            if(userLike != null) return BadRequest("you already like this user");

            userLike  = new Entities.UserLike 
            {
                SourceUserId = int.Parse(sourceUserId),
                LikedUserId = LikedUser.Id
            };

            SourceUser.LikedUsers.Add(userLike);

            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed liked to user");
            
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetLikedUsers(string predicate)
        {
            var users = await _likesRespository.GetUserLikes(predicate, int.Parse(User.GetUsername()));

            return Ok(users);
        }

    }
}