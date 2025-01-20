using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using MoneyCount.Data;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("SqlServerConnection");

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCors(opt => opt.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddDbContext<PaymentDbContext>(
    options => options.UseSqlServer(connectionString));

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
app.UseCors("AllowAll");
ClearDatabase(app);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(@"C:\to-delete"),
    RequestPath = "/StaticFiles"
});

app.Run();

static void ClearDatabase(IApplicationBuilder app)
{
    using (var scope = app.ApplicationServices.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<PaymentDbContext>();

        context.Database.ExecuteSqlRaw("DELETE FROM Categories WHERE Id NOT IN (1, 2, 3)");
        context.Database.ExecuteSqlRaw("DELETE FROM Payments WHERE Id NOT IN (1, 2, 3)");

        context.Database.ExecuteSqlRaw($"DBCC CHECKIDENT ('Categories', RESEED, {context.Categories.Count()})");
        context.Database.ExecuteSqlRaw($"DBCC CHECKIDENT ('Payments', RESEED, {context.Payments.Count()})");
    }
}