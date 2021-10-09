using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUserRole :IdentityUserRole<int>
    {
        private AppRole role;

        public AppUser User { get; set; }

        public AppRole Role { get => role; set => role = value; }
    }
}