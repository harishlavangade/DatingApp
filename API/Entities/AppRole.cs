using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppRole :IdentityRole<int>
    {
        public ICollection<AppRole> UserRole { get; set; }
        public object User { get; internal set; }
    }
}