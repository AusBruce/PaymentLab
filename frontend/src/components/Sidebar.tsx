import type { PaymentLabModel } from '../hooks/usePaymentLab';
import { Icon } from './Icon';

type Props = Pick<PaymentLabModel, 'activeUserName' | 'view' | 'setView' | 'setSearch' | 'accounts'>;

export function Sidebar({ view, setView, setSearch, accounts, activeUserName }: Props) {
  return <aside className="sidebar">
      <a className="brand" href="#overview" onClick={() => setView('overview')}><span className="bank-mark" aria-hidden="true"/>PaymentLab</a>
      <div className="workspace"><span className="workspace-icon">P</span><div><b>Everyday banking</b><small>Your demo banking</small></div><span className="workspace-chevron">⌄</span></div>
      <p className="nav-label">WORKSPACE</p>
      <nav aria-label="Main navigation">{([['overview', 'grid', 'Overview'], ['accounts', 'wallet', 'Accounts'], ['activity', 'arrows', 'Transactions']] as const).map(([key, icon, label]) => <button key={key} className={`nav-item ${view === key ? 'active' : ''}`} aria-current={view === key ? 'page' : undefined} onClick={() => { setView(key); setSearch(''); }}><Icon name={icon}/>{label}{key === 'accounts' && <span className="nav-count">{accounts.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="sandbox-note"><span className="sandbox-icon"><Icon name="info" size={18}/></span><b>A little room to experiment.</b><p>Create accounts. Move money.<br/>Learn how payments work.</p><span className="sandbox-pill"><i/> Sandbox environment</span></div><div className="profile"><span className="profile-avatar">PL</span><div><b>{activeUserName || 'Your profile'}</b><small>Demo profile</small></div><span className="profile-status" title="Local demo"/></div></div>
    </aside>;
}
