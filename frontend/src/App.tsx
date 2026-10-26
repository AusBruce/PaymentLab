import { usePaymentLab } from './hooks/usePaymentLab';
import { Icon } from './components/Icon';
import { Sidebar } from './components/Sidebar';
import { SummaryCards } from './components/SummaryCards';
import { AccountsPanel } from './components/AccountsPanel';
import { TransferPanel } from './components/TransferPanel';
import { ActivityPanel } from './components/ActivityPanel';
import { CreateAccountDialog } from './components/CreateAccountDialog';

export function App() {
  const model = usePaymentLab();
  const { view, title, createButton, openCreate, error, isCreateOpen, setError, notice, setNotice } = model;

  return <div className="shell">
    <Sidebar {...model}/>
    <div className="workspace-main"><header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <b>{view === 'activity' ? 'Transactions' : view[0].toUpperCase() + view.slice(1)}</b></div><div className="user-controls"><label htmlFor="active-user">Banking for</label><select id="active-user" value={model.activeUser} disabled={!!model.busy || !model.users.length} onChange={e => model.selectUser(e.target.value)}>{!model.users.length && <option value="">Create your first user</option>}{model.users.map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select><span className="environment"><i/> Demo mode</span></div></header>
    <main>
      <section className="intro"><div><p className="eyebrow">YOUR EVERYDAY BANKING</p><h1>{title}</h1><p>Your accounts, your balance. Banking made simple.</p></div><button ref={createButton} onClick={openCreate} className="primary"><Icon name="plus" size={17}/> Add account / user</button></section>
      {error && !isCreateOpen && <div className="message error" role="alert"><Icon name="info"/>{error}<button aria-label="Dismiss error" onClick={() => setError('')}><Icon name="close" size={16}/></button></div>}
      {notice && <div className="message success" role="status"><Icon name="check"/>{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><Icon name="close" size={16}/></button></div>}
      <SummaryCards {...model}/>
      <div className={`content-grid ${view !== 'overview' ? 'single-view' : ''}`}>
      {view !== 'activity' && <AccountsPanel {...model}/>}
      {view === 'overview' && <TransferPanel {...model}/>}
      {view !== 'accounts' && <ActivityPanel {...model}/>}
      </div><div className="demo-banner"><span className="banner-icon"><Icon name="info" size={18}/></span><p><b>Built for exploring.</b> This is a local demo with no real money. Account balances reset when the server restarts.</p><span className="demo-badge">PLAY. LEARN. REPEAT.</span></div><footer><span>© {new Date().getFullYear()} PaymentLab</span><span>A little curiosity goes a long way. <span className="footer-spark">✳</span></span></footer>
    </main></div>
    <CreateAccountDialog {...model}/>
  </div>;
}
