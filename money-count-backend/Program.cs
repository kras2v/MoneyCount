using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using MoneyCount.Data;
using MoneyCount.Entities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

var connectionString = builder.Configuration.GetConnectionString("SqlServerConnection");
builder.Services.AddDbContext<MoneyCountDbContext>(
    options => options.UseSqlServer(connectionString));

builder.Services.AddIdentityApiEndpoints<User>().AddEntityFrameworkStores<MoneyCountDbContext>();

builder.Services.AddIdentityCore<User>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
    options.Password.RequireDigit = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 0;

    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    options.User.AllowedUserNameCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._@+!";
    options.User.RequireUniqueEmail = true;
}).AddEntityFrameworkStores<MoneyCountDbContext>();

builder.Services.AddAuthentication()
    .AddCookie(options =>
    {
        options.Cookie.Name = ".MoneyCount"; // Customize cookie name
        options.Cookie.HttpOnly = true; // Important for security
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // For HTTPS (highly recommended)
        options.Cookie.SameSite = SameSiteMode.Strict; // Helps prevent CSRF attacks
        options.ExpireTimeSpan = TimeSpan.FromMinutes(30); // Set cookie expiration
        options.SlidingExpiration = true; // Extend expiration on activity
    });

builder.Services.AddCors(opt => opt.AddPolicy("AllowFrontend",
    p => p.WithOrigins("http://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()));

//builder.Services.AddEndpointsApiExplorer();     
builder.Services.AddSwaggerGen(); 
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var app = builder.Build();
var port = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");

Console.WriteLine($"Server has been launched -> {port}..\n");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(@"C:\to-delete"),
    RequestPath = "/StaticFiles"
});

app.UseCors("AllowFrontend"); 
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.MapIdentityApi<User>();

app.MapControllers();

//ClearDatabase(app);
app.Run();

static void ClearDatabase(IApplicationBuilder app)
{
    using (var scope = app.ApplicationServices.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<MoneyCountDbContext>();

        context.Database.ExecuteSql($"DBCC CHECKIDENT ('Categories', RESEED, {context.Categories.Count()})");
        context.Database.ExecuteSql($"DBCC CHECKIDENT ('Transactions', RESEED, {context.Transactions.Count()})");
    }
}