namespace PaymentLab.Api.Models;

public sealed record Transaction(Guid Id, Guid FromAccountId, Guid ToAccountId,
    decimal Amount, DateTimeOffset CreatedAt);
