using PaymentLab.Api.Models;

namespace PaymentLab.Api.Services;

public sealed class InMemoryAccountService : IAccountService
{
    private readonly object gate = new();
    private readonly Dictionary<Guid, Account> accounts = new();
    private readonly List<Transaction> transactions = new();

    public IReadOnlyList<Account> GetAccounts()
    {
        lock (gate) return accounts.Values.ToArray();
    }

    public Account? GetAccount(Guid id)
    {
        lock (gate) return accounts.GetValueOrDefault(id);
    }

    public Account CreateAccount(string ownerName, decimal initialBalance)
    {
        if (string.IsNullOrWhiteSpace(ownerName))
            throw new ArgumentException("Owner name is required.");
        if (initialBalance < 0) throw new ArgumentException("Initial balance cannot be negative.");
        lock (gate)
        {
            var account = new Account(Guid.NewGuid(), ownerName.Trim(), initialBalance);
            accounts.Add(account.Id, account);
            return account;
        }
    }

    public Transaction Transfer(Guid fromAccountId, Guid toAccountId, decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be positive.");
        if (fromAccountId == toAccountId) throw new ArgumentException("Accounts must be different.");
        lock (gate)
        {
            if (!accounts.TryGetValue(fromAccountId, out var source) ||
                !accounts.TryGetValue(toAccountId, out var destination))
                throw new KeyNotFoundException("Account not found.");
            if (source.Balance < amount) throw new InvalidOperationException("Insufficient funds.");
            // Calculate both balances before changing state, including checking for decimal overflow.
            decimal destinationBalance;
            try { destinationBalance = destination.Balance + amount; }
            catch (OverflowException) { throw new ArgumentException("Destination balance would exceed the supported limit."); }
            var transaction = new Transaction(Guid.NewGuid(), fromAccountId, toAccountId, amount, DateTimeOffset.UtcNow);
            accounts[fromAccountId] = source with { Balance = source.Balance - amount };
            accounts[toAccountId] = destination with { Balance = destinationBalance };
            transactions.Add(transaction);
            return transaction;
        }
    }
}
