using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using API.DTOs;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using API.Helpers;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly IMapper _mapper;

        private readonly DataContext _context;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

       


 

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParms)
        {
             var query = _context.Users
                            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                            .AsNoTracking();

                return await PagedList<MemberDto>.CreateAsync(query,userParms.PageNumber,userParms.PageSize);            
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            //throw new System.NotImplementedException();
            return await _context.Users.Where(x => x.UserName == username)
                                        .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                                        .SingleOrDefaultAsync();
            //   .Select( user => new MemberDto{
            //     Id =user.Id,
            //     Username= user.UserName   
            //   }).SingleOrDefaultAsync();
            // return await _context.Users.Where(x => x.UserName == username)
            // .Select( user => new MemberDto
            // {
            //     Id = user.id,
            //     username = user.username

            // }).SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<MemberDto>> GetMembersAsync()
        {
            return await _context.Users
                                 .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                                 .ToListAsync();
        }

        

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUserNameAsync(string username)
        {
            return await _context.Users
                         .Include(p => p.Photos)
                         .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
                                 .Include(p => p.Photos)
                                 .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}