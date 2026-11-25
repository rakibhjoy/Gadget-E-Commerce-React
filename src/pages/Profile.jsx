import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, LogOut, MapPin, Package, UserRound } from 'lucide-react';
import { useAuth, useOrders } from '../context/storeContexts';
import { AddressFields } from '../components/CheckoutFields';
import { Breadcrumbs, EmptyState, PageTitle } from '../components/StoreUI';
import { normalizePhone, validPhone, validateAddress } from '../utils/commerce';
import { formatBDT } from '../utils/format';

const tabs = [['profile', 'Profile', UserRound], ['addresses', 'Saved addresses', MapPin], ['orders', 'Order history', Package]];

function readAvatar(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Profile() {
  const { user, updateProfile, saveAddress, deleteAddress, setDefaultAddress, logout } = useAuth();
  const { getUserOrders } = useOrders();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const tab = tabs.some(([id]) => params.get('tab') === id) ? params.get('tab') : 'profile';
  if (!user) return <EmptyState title="Your Joy Mart account" text="Sign in to manage your profile, addresses and demo orders." to="/login?redirect=%2Fprofile" action="Sign in" />;

  function commit(action, success) {
    setError('');
    setNotice('');
    try { action(); setNotice(success); return true; }
    catch { setError('Changes could not be saved. Check browser storage and try again.'); return false; }
  }

  async function saveProfile(event) {
    event.preventDefault();
    if (saving) return;
    const data = new FormData(event.currentTarget);
    const name = data.get('name').trim();
    const phone = data.get('phone').trim();
    const file = data.get('avatar');
    setError('');
    setNotice('');
    if (name.length < 2) { setError('Enter your full name.'); return; }
    if (phone && !validPhone(phone)) { setError('Enter a valid Bangladesh mobile number.'); return; }
    if (file.size && (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 800000)) {
      setError('Choose a JPEG, PNG or WebP image up to 800 KB.');
      return;
    }
    setSaving(true);
    try {
      const avatar = file.size ? await readAvatar(file) : user.avatar;
      commit(() => updateProfile({ name, phone: normalizePhone(phone), avatar }), 'Profile saved.');
    } catch {
      setError('The profile photo could not be read.');
    } finally {
      setSaving(false);
    }
  }

  function saveDeliveryAddress(event) {
    event.preventDefault();
    const fields = Object.fromEntries([...new FormData(event.currentTarget)].map(([key, value]) => [key, value.trim()]));
    const invalid = validateAddress(fields) || (!fields.label ? 'Enter an address label.' : '');
    if (invalid) { setError(invalid); setNotice(''); return; }
    fields.phone = normalizePhone(fields.phone);
    if (commit(() => saveAddress(fields, editing.id), 'Address saved.')) setEditing(null);
  }

  const orders = getUserOrders(user.email);
  const addresses = user.addresses ?? [];

  return <div className="container page">
    <Breadcrumbs items={[{ label: 'My account' }]} />
    <PageTitle title="My account" subtitle={'Signed in as ' + user.email + ' · Demo account'} />
    <div className="account-layout">
      <nav className="panel account-nav" aria-label="Account sections">
        {tabs.map(([id, title, Icon]) => <Link key={id} to={'/profile?tab=' + id} aria-current={tab === id ? 'page' : undefined} onClick={() => { setEditing(null); setError(''); setNotice(''); }}><Icon size={19} /> {title}</Link>)}
        <button type="button" className="link-button" onClick={() => { logout(); navigate('/login'); }}><LogOut size={19} /> Sign out</button>
      </nav>
      <section className="panel account-content">
        {notice && <p className="notice" role="status">{notice}</p>}
        {error && <p className="error-text" role="alert">{error}</p>}
        {tab === 'profile' && <form className="stack" onSubmit={saveProfile}>
          <h2>Profile details</h2>
          {user.avatar ? <img className="avatar" src={user.avatar} alt={user.name + ' profile photo'} width="72" height="72" /> : <span className="account-icon"><UserRound size={26} /></span>}
          <label>Full name<input name="name" required minLength="2" maxLength="100" autoComplete="name" defaultValue={user.name} /></label>
          <label>Email<input type="email" readOnly value={user.email} /></label>
          <label>Mobile number<input type="tel" name="phone" autoComplete="tel" maxLength="24" defaultValue={user.phone} /></label>
          <label>Profile photo<input type="file" name="avatar" accept="image/png,image/jpeg,image/webp" /><small>JPEG, PNG or WebP · Up to 800 KB</small></label>
          <button type="submit" className="button primary" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
        </form>}
        {tab === 'addresses' && <div className="stack">
          <div className="between"><h2>Saved addresses</h2><button type="button" className="button secondary" onClick={() => { setEditing({ recipientName: user.name, phone: user.phone }); setError(''); setNotice(''); }}>Add address</button></div>
          {editing && <form className="stack notice address-editor" key={editing.id ?? 'new'} onSubmit={saveDeliveryAddress}>
            <h3>{editing.id ? 'Edit address' : 'New address'}</h3>
            <AddressFields values={editing} label />
            <div className="form-actions"><button type="button" className="button secondary" onClick={() => { setEditing(null); setError(''); }}>Cancel</button><button type="submit" className="button primary">Save address</button></div>
          </form>}
          {!addresses.length && !editing && <p className="muted">You have no saved addresses yet.</p>}
          {addresses.map((item) => <article className="address-card" key={item.id}>
            <div className="between"><h3>{item.label}</h3>{item.isDefault && <span className="chip">Default</span>}</div>
            <p>{item.recipientName || user.name} · {item.phone || user.phone}</p><p className="muted">{item.address}, {item.area}, {item.city}</p>
            <div className="button-row">
              <button type="button" className="link-button" onClick={() => { setEditing(item); setError(''); setNotice(''); }}>Edit</button>
              {!item.isDefault && <button type="button" className="link-button" onClick={() => commit(() => setDefaultAddress(item.id), 'Default address updated.')}>Set as default</button>}
              <button type="button" className="link-button error-text" onClick={() => { if (commit(() => deleteAddress(item.id), 'Address removed.') && editing?.id === item.id) setEditing(null); }}>Remove</button>
            </div>
          </article>)}
        </div>}
        {tab === 'orders' && <div className="stack"><h2>Order history</h2>{orders.length ? <ul className="account-orders">{orders.map((order) => <li key={order.id}>
          <Link to={'/orders/' + order.id}><span><b>{order.id}</b><small>Demo order · {order.items?.length ?? 0} line items</small></span><strong>{formatBDT(order.total)}</strong><ArrowRight size={17} /></Link>
        </li>)}</ul> : <p className="muted">Orders placed while signed in will appear here.</p>}</div>}
      </section>
    </div>
  </div>;
}
