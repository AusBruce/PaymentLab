using PaymentLab.Api.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IAccountService, InMemoryAccountService>();
var app = builder.Build();

app.MapGet("/accounts", (IAccountService service) => Results.Ok(service.GetAccounts()));
app.MapGet("/accounts/{id:guid}", (Guid id, IAccountService service) =>
    service.GetAccount(id) is { } account ? Results.Ok(account) : Results.NotFound());
app.MapPost("/accounts", (CreateAccountRequest request, IAccountService service) =>
{
    try
    {
        var account = service.CreateAccount(request.OwnerName, request.InitialBalance);
        return Results.Created($"/accounts/{account.Id}", account);
    }
    catch (ArgumentException ex) { return Results.BadRequest(new { error = ex.Message }); }
});
app.MapPost("/transfers", (TransferRequest request, IAccountService service) =>
{
    try { return Results.Ok(service.Transfer(request.FromAccountId, request.ToAccountId, request.Amount)); }
    catch (ArgumentException ex) { return Results.BadRequest(new { error = ex.Message }); }
    catch (KeyNotFoundException ex) { return Results.NotFound(new { error = ex.Message }); }
    catch (InvalidOperationException ex) { return Results.Conflict(new { error = ex.Message }); }
});

app.Run();

public sealed record CreateAccountRequest(string OwnerName, decimal InitialBalance);
public sealed record TransferRequest(Guid FromAccountId, Guid ToAccountId, decimal Amount);
public partial class Program { }
