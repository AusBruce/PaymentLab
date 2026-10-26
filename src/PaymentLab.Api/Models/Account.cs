namespace PaymentLab.Api.Models;

public sealed record Account(Guid Id, string OwnerName, decimal Balance);
