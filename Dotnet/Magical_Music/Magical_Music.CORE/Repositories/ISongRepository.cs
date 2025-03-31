using Magical_Music.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Magical_Music.CORE.Repositories
{
    public interface ISongRepository
    {
        public Task<IEnumerable<Song>> GetAllAsync();
        public Task<Song> GetByIdAsync(int id);
        public Task<Song> AddAsync(Song song);
        public Task<Song> UpdateAsync(int id, Song song);
        public Task DeleteAsync(int id);
        Task<IEnumerable<Song>> GetByCreatorIdAsync(int creatorId);
    }
}
