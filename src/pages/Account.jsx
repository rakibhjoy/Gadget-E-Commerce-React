import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/storeContexts';
import { accountDestination } from '../utils/commerce';

export default function Account({ mode }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const destination = accountDestination(params.get('redirect'));
  const redirect = params.has('redirect') ? '?redirect=' + encodeURIComponent(destination) : '';
  const joining = mode === 'register';
  const resetting = mode === 'reset';

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const name = new FormData(event.currentTarget).get('name') ?? '';
    const result = await (joining ? register(name, email, password) : login(email, password));
    if (result.error) {
      setError(result.error);
      setBusy(false);
    } else navigate(destination, { replace: true });
  }

  return <div className="container page">
    <section className="panel account-panel">
      <h1>{joining ? 'Create an account' : resetting ? 'Password reset' : 'Sign in to Joy Mart'}</h1>
      <p className="muted">{resetting ? 'Email-based password reset requires a live authentication service and is unavailable in this demo.' : 'Manage your saved addresses and view orders placed through this browser.'}</p>
      <p className="notice small">Demo accounts are stored on this browser. Use sample contact details and a demo-only password.</p>
      {resetting ? <Link className="button primary full-button" to={'/login' + redirect}>Back to sign in <ArrowRight size={17} /></Link> : <>
        <form className="stack" onSubmit={submit}>
          {joining && <label>Full name<input name="name" autoComplete="name" required minLength="2" maxLength="100" /></label>}
          <label>Email<input type="email" value={email} autoComplete="email" maxLength="160" onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<input type="password" value={password} autoComplete={joining ? 'new-password' : 'current-password'} minLength={joining ? 8 : undefined} maxLength="128" onChange={(event) => setPassword(event.target.value)} required /></label>
          {!joining && <Link className="text-link" to={'/forgot-password' + redirect}>Forgot password?</Link>}
          {error && <p className="error-text" role="alert">{error}</p>}
          <button className="button primary full-button" type="submit" disabled={busy}>{busy ? 'Please wait…' : joining ? 'Create demo account' : 'Sign in'} <ArrowRight size={17} /></button>
        </form>
        {!joining && <button type="button" className="button secondary full-button" onClick={() => { setEmail('demo@joymart.com'); setPassword('password123'); setError(''); }}>Use demo credentials</button>}
        <p className="small muted">{joining ? 'Already registered?' : 'New to Joy Mart?'} <Link className="text-link" to={(joining ? '/login' : '/register') + redirect}>{joining ? 'Sign in' : 'Create an account'}</Link></p>
      </>}
    </section>
  </div>;
}

Account.propTypes = { mode: PropTypes.oneOf(['login', 'register', 'reset']).isRequired };
