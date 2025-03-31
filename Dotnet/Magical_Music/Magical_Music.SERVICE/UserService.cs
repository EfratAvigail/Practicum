using AutoMapper;
using Magical_Music.CORE.DTOs;
using Magical_Music.CORE.Models;
using Magical_Music.CORE.Repositories;
using Magical_Music.CORE.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Magical_Music.SERVICE
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<User>> GetAllAsync() => await _userRepository.GetAllAsync();
        public async Task<User> GetByIdAsync(int id) => await _userRepository.GetByIdAsync(id);

        public async Task<User> AddAsync(UserDTO userDto)
        {
            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password = userDto.Password,
                Role = "user"
            };

            return await _userRepository.AddAsync(user);
        }

        public async Task<User> UpdateAsync(int id, UserDTO userDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;

            user.Name = userDto.Name;
            user.Email = userDto.Email;
            user.Password = userDto.Password;

            return await _userRepository.UpdateAsync(id, user);
        }

        public async Task DeleteAsync(int id) => await _userRepository.DeleteAsync(id);

        public async Task<User> Authenticate(string Password, string userPassword)
        {
            // הנחה שהשיטה GetByPasswordAsync מחזירה IEnumerable<User>
            var users = await _userRepository.GetByPasswordAsync(Password);
            var user = users.FirstOrDefault(); // קבל את המשתמש הראשון או null אם לא קיים

            if (user != null && BCrypt.Net.BCrypt.Verify(userPassword, user.Password))
            {
                user.Role = "user"; // כאן אתה יכול לגשת ל-Role
                return user;
            }

            return new User
            {
                Name = Password,
                Password = userPassword,
                Role = "viewer"
            };
        }
    }
}
