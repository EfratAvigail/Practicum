// הוספת המרחב השמות הנדרש
using Magical_Music.CORE.Repositories;
using Magical_Music.CORE.Services;
using Magical_Music.DATA.Repositories;
using Magical_Music.DATA;
using Magical_Music.SERVICE;
using MagicalMusic.DATA.Repositories;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using System.Text;

namespace Magical_Music
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // טוען את משתני הסביבה מקובץ .env
            DotNetEnv.Env.Load();

            // שליפת המפתח JWT_KEY
            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            Console.WriteLine($"JWT_KEY: {jwtKey}"); // הדפסת המפתח

            var builder = WebApplication.CreateBuilder(args);

            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new ArgumentNullException("Jwt:Key", "JWT Key must be provided in .env file");
            }

            // הוספת שירותים
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.WriteIndented = true;
                });

            // הוספת מדיניות CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.WithOrigins("http://localhost:5173") // הכתובת של הלקוח שלך
                                      .AllowAnyMethod()
                                      .AllowAnyHeader());
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Description = "Bearer Authentication with JWT Token",
                    Type = SecuritySchemeType.Http
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Id = "Bearer",
                                Type = ReferenceType.SecurityScheme
                            }
                        },
                        new List<string>()
                    }
                });
            });

            // הזרקות שירותים
            builder.Services.AddScoped<ISongService, SongService>();
            builder.Services.AddScoped<ISongRepository, SongRepository>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<ISingerRepository, SingerRepository>();
            builder.Services.AddScoped<ISingerService, SingerService>();
            builder.Services.AddScoped<AuthService>();

            builder.Services.AddAutoMapper(typeof(MappingProfile));
            // הוספת DbContext
            builder.Services.AddDbContext<DataContext>(options =>
                options.UseMySql(
                    @"Server=btw6ujkgafer3ugtuqgm-mysql.services.clever-cloud.com;
                      Port=3306;
                      Database=btw6ujkgafer3ugtuqgm;
                      User=uvlvqnqycwjraz9t;
                      Password=qCV6Kk3IFLptHiJRXMV9",
                    new MySqlServerVersion(new Version(8, 0, 21)))); // שנה לגרסה המתאימה

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowSpecificOrigin"); // הוספת השורה הזו להפעלת CORS
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
