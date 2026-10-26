import type { PaymentLabModel } from '../hooks/usePaymentLab';
import { Icon } from './Icon';

type Props = Pick<PaymentLabModel, 'view' | 'setView' | 'setSearch' | 'accounts'>;

export function Sidebar({ view, setView, setSearch, accounts }: Props) {
  return <aside className="sidebar">
      <a className="brand" href="#overview" onClick={() => setView('overview')}><span className="brand-mark">p<span>↗</span></span>paymentlab<span className="brand-dot">.</span></a>
      <div className="workspace"><span className="workspace-icon">P</span><div><b>Personal workspace</b><small>Learning environment</small></div><span className="workspace-chevron">⌄</span></div>
      <p className="nav-label">WORKSPACE</p>
      <nav aria-label="Main navigation">{([['overview', 'grid', 'Overview'], ['accounts', 'wallet', 'Accounts'], ['activity', 'arrows', 'Transactions']] as const).map(([key, icon, label]) => <button key={key} className={`nav-item ${view === key ? 'active' : ''}`} aria-current={view === key ? 'page' : undefined} onClick={() => { setView(key); setSearch(''); }}><Icon name={icon}/>{label}{key === 'accounts' && <span className="nav-count">{accounts.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="sandbox-note"><span className="sandbox-icon"><Icon name="info" size={18}/></span><b>A little room to experiment.</b><p>Create accounts. Move money.<br/>Learn how payments work.</p><span className="sandbox-pill"><i/> Sandbox environment</span></div><div className="profile"><span className="profile-avatar">PL</span><div><b>PaymentLab</b><small>Local workspace</small></div><span className="profile-status" title="Local demo"/></div></div>
    </aside>;
}
