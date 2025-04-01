using Magical_Music.CORE.Repositories;
using Magical_Music.CORE.Services;
using Magical_Music.DATA.Repositories;
using Magical_Music.DATA;
using Magical_Music.SERVICE;
using Microsoft.EntityFrameworkCore; // הוספת המרחב השמות
using AutoMapper;
using MagicalMusic.DATA.Repositories;

namespace Magical_Music
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // הזרקות שירותים
            builder.Services.AddScoped<ISongService, SongService>();
            builder.Services.AddScoped<ISongRepository, SongRepository>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();

            // הוספת DbContext
            builder.Services.AddDbContext<DataContext>(options =>
                options.UseMySql(
                    @"Server=btw6ujkgafer3ugtuqgm-mysql.services.clever-cloud.com;
                      Port=3306;
                      Database=btw6ujkgafer3ugtuqgm;
                      User=uvlvqnqycwjraz9t;
                      Password=qCV6Kk3IFLptHiJRXMV9",
                    new MySqlServerVersion(new Version(8, 0, 21)))); // שנה לגרסה המתאימה

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddAutoMapper(typeof(MappingProfile));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
