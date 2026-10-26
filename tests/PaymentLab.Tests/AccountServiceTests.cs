using PaymentLab.Api.Services;

namespace PaymentLab.Tests;

public class AccountServiceTests
{
    [Fact]
    public void CreateAccountStoresTrimmedOwnerAndBalance()
    {
        var service = new InMemoryAccountService();
        var account = service.CreateAccount(" Alice ", 100m);
        Assert.Equal("Alice", account.OwnerName);
        Assert.Equal(account, service.GetAccount(account.Id));
        Assert.Single(service.GetAccounts());
    }

    [Theory]
    [InlineData("", 0)]
    [InlineData("  ", 0)]
    [InlineData("Alice", -1)]
    public void InvalidAccountIsRejected(string owner, decimal balance)
        => Assert.Throws<ArgumentException>(() => new InMemoryAccountService().CreateAccount(owner, balance));

    [Fact]
    public void TransferUpdatesBothBalancesAndReturnsTransaction()
    {
        var service = new InMemoryAccountService();
        var source = service.CreateAccount("Alice", 100m);
        var destination = service.CreateAccount("Bob", 10m);
        var transaction = service.Transfer(source.Id, destination.Id, 25m);
        Assert.Equal(75m, service.GetAccount(source.Id)!.Balance);
        Assert.Equal(35m, service.GetAccount(destination.Id)!.Balance);
        Assert.Equal(source.Id, transaction.FromAccountId);
        Assert.Equal(destination.Id, transaction.ToAccountId);
        Assert.Equal(25m, transaction.Amount);
        Assert.NotEqual(Guid.Empty, transaction.Id);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void NonPositiveTransferIsRejected(decimal amount)
    {
        var service = new InMemoryAccountService();
        Assert.Throws<ArgumentException>(() => service.Transfer(Guid.NewGuid(), Guid.NewGuid(), amount));
    }

    [Fact]
    public void FailedTransfersLeaveBalancesUnchanged()
    {
        var service = new InMemoryAccountService();
        var source = service.CreateAccount("Alice", 10m);
        var destination = service.CreateAccount("Bob", 0m);
        Assert.Throws<InvalidOperationException>(() => service.Transfer(source.Id, destination.Id, 11m));
        Assert.Throws<ArgumentException>(() => service.Transfer(source.Id, source.Id, 1m));
        Assert.Throws<KeyNotFoundException>(() => service.Transfer(source.Id, Guid.NewGuid(), 1m));
        Assert.Equal(10m, service.GetAccount(source.Id)!.Balance);
        Assert.Equal(0m, service.GetAccount(destination.Id)!.Balance);
    }

    [Fact]
    public void OverflowLeavesBothAccountsUnchanged()
    {
        var service = new InMemoryAccountService();
        var source = service.CreateAccount("Alice", 10m);
        var destination = service.CreateAccount("Bob", decimal.MaxValue);
        Assert.Throws<ArgumentException>(() => service.Transfer(source.Id, destination.Id, 1m));
        Assert.Equal(10m, service.GetAccount(source.Id)!.Balance);
        Assert.Equal(decimal.MaxValue, service.GetAccount(destination.Id)!.Balance);
    }

    [Fact]
    public void ConcurrentTransfersCannotOverdrawAccount()
    {
        var service = new InMemoryAccountService();
        var source = service.CreateAccount("Alice", 100m);
        var destination = service.CreateAccount("Bob", 0m);
        var successes = 0;
        Parallel.For(0, 200, _ =>
        {
            try { service.Transfer(source.Id, destination.Id, 1m); Interlocked.Increment(ref successes); }
            catch (InvalidOperationException) { }
        });
        Assert.Equal(100, successes);
        Assert.Equal(0m, service.GetAccount(source.Id)!.Balance);
        Assert.Equal(100m, service.GetAccount(destination.Id)!.Balance);
    }
}
