import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { paymentsApi } from '../api/payments';
import type { Account, Transaction, View, PendingAction } from '../types/payment';
import { exportActivityCsv } from '../utils/exportActivity';

export function usePaymentLab() {
  const [view, setView] = useState<View>('overview');
  const [allAccounts, setAccounts] = useState<Account[]>([]);
  const [allTransactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<PendingAction>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [activityAccount, setActivityAccount] = useState('');
  const [owner, setOwner] = useState('');
  const [balance, setBalance] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [review, setReview] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const createButton = useRef<HTMLButtonElement>(null);
  const [selectedUser, setSelectedUser] = useState('');
  const ownerKey = (name: string) => name.trim().toLocaleLowerCase();
  const users = Array.from(new Map(allAccounts.map(a => [ownerKey(a.ownerName), a.ownerName])).entries());
  const activeUser = users.some(([key]) => key === selectedUser) ? selectedUser : users[0]?.[0] ?? '';
  const activeUserName = users.find(([key]) => key === activeUser)?.[1] ?? '';
  const accounts = allAccounts.filter(a => ownerKey(a.ownerName) === activeUser);
  const accountIds = new Set(accounts.map(a => a.id));
  const transactions = allTransactions.filter(t => accountIds.has(t.fromAccountId) || accountIds.has(t.toAccountId));
  function selectUser(key: string) {
    setSelectedUser(key); setFrom(''); setTo(''); setAmount(''); setReview(false);
    setActivityAccount(''); setSearch(''); setNotice(''); setError('');
  }
  const source = accounts.find(a => a.id === from);
  const destination = allAccounts.find(a => a.id === to);
  const amountValue = Number(amount);
  const validAmount = Number.isFinite(amountValue) && amountValue > 0 && /^\d+(\.\d{1,2})?$/.test(amount);
  const canTransfer = !!source && !!destination && from !== to && validAmount && amountValue <= source.balance;
  const total = accounts.reduce((sum, a) => sum + a.balance, 0);
  const volume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const filteredAccounts = accounts.filter(a => `${a.ownerName} ${a.id}`.toLowerCase().includes(search.toLowerCase()));
  const filteredTransactions = transactions.filter(t => !activityAccount || t.fromAccountId === activityAccount || t.toAccountId === activityAccount);
  const accountName = (id: string) => allAccounts.find(a => a.id === id)?.ownerName ?? id.slice(0, 8);

  async function refresh(): Promise<boolean> {
    setLoading(true);
    try {
      const next = await paymentsApi.getAccounts();
      setAccounts(next); setConnected(true);
      setFrom(id => next.some(a => a.id === id) ? id : '');
      setTo(id => next.some(a => a.id === id) ? id : '');
      return true;
    } catch (err) { setConnected(false); setError(err instanceof Error ? err.message : 'Unable to load accounts.'); return false; }
    finally { setLoading(false); }
  }
  useEffect(() => { void refresh(); }, []);
  useEffect(() => { setReview(false); }, [from, to, amount]);
  async function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy('create'); setError(''); setNotice('');
    try {
      if (!owner.trim() || !Number.isFinite(Number(balance)) || Number(balance) < 0) throw new Error('Enter an owner and a valid opening balance.');
      const account = await paymentsApi.createAccount({ ownerName: owner.trim(), initialBalance: Number(balance) });
      setAccounts(previous => [...previous, account]);
      selectUser(ownerKey(account.ownerName));
      setOwner(''); setBalance(''); dialog.current?.close(); setNotice(`Account created for ${account.ownerName}.`);
      await refresh();
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to create account.'); }
    finally { setBusy(null); }
  }
  async function transfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !canTransfer) return;
    if (!review) { setReview(true); return; }
    setBusy('transfer'); setError(''); setNotice('');
    try {
      const transaction = await paymentsApi.transfer({ fromAccountId: from, toAccountId: to, amount: amountValue });
      setTransactions(previous => [transaction, ...previous]);
      setAmount(''); setReview(false); setNotice('Transfer completed successfully.');
      await refresh();
    } catch (err) { setReview(false); setError(err instanceof Error ? err.message : 'Unable to complete transfer.'); }
    finally { setBusy(null); }
  }
  const exportActivity = () => exportActivityCsv(filteredTransactions, accountName);
  function openCreate() { setOwner(activeUserName); setError(''); setIsCreateOpen(true); dialog.current?.showModal(); }
  function closeCreate() { setIsCreateOpen(false); createButton.current?.focus(); }
  const title = view === 'overview' ? (activeUserName ? `Hello, ${activeUserName}.` : 'Welcome to your banking.') : view === 'accounts' ? 'Your accounts' : 'Your transactions';


  return {
    users,
    activeUser,
    activeUserName,
    selectUser,
    allAccounts,
    view,
    setView,
    accounts,
    transactions,
    loading,
    busy,
    connected,
    error,
    setError,
    notice,
    setNotice,
    search,
    setSearch,
    activityAccount,
    setActivityAccount,
    owner,
    setOwner,
    balance,
    setBalance,
    from,
    setFrom,
    to,
    setTo,
    amount,
    setAmount,
    review,
    setReview,
    dialog,
    createButton,
    source,
    destination,
    amountValue,
    validAmount,
    canTransfer,
    total,
    volume,
    filteredAccounts,
    filteredTransactions,
    accountName,
    refresh,
    createAccount,
    transfer,
    exportActivity,
    openCreate,
    closeCreate,
    isCreateOpen,
    title
  };
}

export type PaymentLabModel = ReturnType<typeof usePaymentLab>;
