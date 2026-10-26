import type { PaymentLabModel } from '../hooks/usePaymentLab';
import { Icon } from './Icon';
import { money } from '../utils/format';

type Props = Pick<PaymentLabModel, 'activeUserName' | 'loading' | 'accounts' | 'total' | 'volume' | 'transactions'>;

export function SummaryCards({ loading, accounts, total, volume, transactions, activeUserName }: Props) {
  return <section className="stats" aria-label="Workspace summary"><article className="stat featured"><div className="stat-label">Total balance <Icon name="wallet"/></div><strong>{loading && !accounts.length ? '—' : money(total)} <span>units</span></strong><div className="stat-foot"><span className="light-dot"/> {activeUserName ? `${activeUserName}’s accounts only` : 'Create a user to get started'}</div><div className="card-decoration"/></article><article className="stat"><div className="stat-label">Active accounts<span className="stat-icon"><Icon name="wallet" size={18}/></span></div><strong>{accounts.length.toString().padStart(2, '0')}</strong><div className="stat-foot"><span className="green-dot"/> Ready to send and receive</div></article><article className="stat"><div className="stat-label">Transfer volume<span className="stat-icon purple"><Icon name="arrows" size={18}/></span></div><strong>{money(volume)} <span>units</span></strong><div className="stat-foot">{transactions.length} completed {transactions.length === 1 ? 'transfer' : 'transfers'} <span className="session-tag">This session</span></div></article></section>;
}
