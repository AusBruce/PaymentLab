import type { Transaction } from '../types/payment';

export function exportActivityCsv(transactions: Transaction[], accountName: (id: string) => string) {
    const quote = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const rows = [['Transaction ID', 'From', 'To', 'Amount', 'Created at'], ...transactions.map(t => [t.id, accountName(t.fromAccountId), accountName(t.toAccountId), t.amount.toFixed(2), t.createdAt])];
    const url = URL.createObjectURL(new Blob([rows.map(row => row.map(quote).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'paymentlab-activity.csv'; link.click(); URL.revokeObjectURL(url);
  }
