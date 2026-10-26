using PaymentLab.Api.Models;

namespace PaymentLab.Api.Services;

public interface IAccountService
{
    IReadOnlyList<Account> GetAccounts();
    Account? GetAccount(Guid id);
    Account CreateAccount(string ownerName, decimal initialBalance);
    Transaction Transfer(Guid fromAccountId, Guid toAccountId, decimal amount);
}
