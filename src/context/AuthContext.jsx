import { useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './storeContexts';
import { readList, readStorage } from '../utils/storage';

const USERS = 'joymart_users';
const SESSION = 'joymart_user';
const DEMO = {
  name: 'Joy Ahmed', email: 'demo@joymart.com', password: 'password123', phone: '01711234567',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  addresses: [
    { id: 'addr-1', label: 'Home', recipientName: 'Joy Ahmed', phone: '01711234567', city: 'Dhaka', area: 'Gulshan-2', address: 'House 42, Road 11, Block D', isDefault: true },
    { id: 'addr-2', label: 'Office', recipientName: 'Joy Ahmed', phone: '01711234567', city: 'Dhaka', area: 'Banani', address: 'Plot 18, Kemal Ataturk Avenue', isDefault: false },
  ],
};

const cleanEmail = (email) => email.trim().toLowerCase();
function publicProfile(record) {
  const profile = { ...record };
  delete profile.password;
  delete profile.passwordHash;
  delete profile.salt;
  return profile;
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2', salt: encoder.encode(salt), iterations: 210000, hash: 'SHA-256',
  }, key, 256);
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function passwordFields(password) {
  const salt = crypto.randomUUID();
  return { salt, passwordHash: await hashPassword(password, salt) };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorage(SESSION, null));

  function saveProfile(record) {
    const users = readList(USERS);
    const current = users.find((item) => cleanEmail(item.email) === cleanEmail(record.email));
    const next = { ...current, ...record };
    const profile = publicProfile(next);
    const updated = users.filter((item) => cleanEmail(item.email) !== cleanEmail(next.email));
    localStorage.setItem(USERS, JSON.stringify([...updated, next]));
    localStorage.setItem(SESSION, JSON.stringify(profile));
    setUser(profile);
  }

  async function login(email, password) {
    try {
      const wanted = cleanEmail(email);
      const record = readList(USERS).find((item) => cleanEmail(item.email) === wanted) ?? (wanted === DEMO.email ? DEMO : null);
      if (!record || (record.passwordHash ? await hashPassword(password, record.salt) !== record.passwordHash : password !== record.password)) {
        return { error: 'Email or password is incorrect.' };
      }
      const secureFields = crypto.subtle && !record.passwordHash ? await passwordFields(password) : {};
      saveProfile({ ...record, ...secureFields, password: record.passwordHash || secureFields.passwordHash ? undefined : record.password });
      return {};
    } catch {
      return { error: 'Local sign-in is unavailable. Check browser storage and use localhost or HTTPS.' };
    }
  }

  async function register(name, email, password) {
    try {
      const normalizedEmail = cleanEmail(email);
      if (normalizedEmail === DEMO.email || readList(USERS).some((item) => cleanEmail(item.email) === normalizedEmail)) {
        return { error: 'An account with this email already exists on this browser.' };
      }
      if (name.trim().length < 2) return { error: 'Enter your full name.' };
      if (password.length < 8) return { error: 'Use at least 8 characters for the demo password.' };
      saveProfile({ name: name.trim(), email: normalizedEmail, phone: '', avatar: '', addresses: [], ...await passwordFields(password) });
      return {};
    } catch {
      return { error: 'Local registration needs browser storage and localhost or HTTPS.' };
    }
  }

  function updateProfile(fields) {
    saveProfile({ ...user, ...fields });
  }

  function saveAddress(address, id = crypto.randomUUID()) {
    const addresses = user.addresses ?? [];
    const existing = addresses.find((item) => item.id === id);
    const updated = { ...address, id, isDefault: existing?.isDefault ?? !addresses.length };
    updateProfile({ addresses: existing ? addresses.map((item) => item.id === id ? updated : item) : [...addresses, updated] });
  }

  function deleteAddress(id) {
    const remaining = user.addresses.filter((item) => item.id !== id);
    const defaultId = remaining.find((item) => item.isDefault)?.id ?? remaining[0]?.id;
    updateProfile({ addresses: remaining.map((item) => ({ ...item, isDefault: item.id === defaultId })) });
  }

  function setDefaultAddress(id) {
    updateProfile({ addresses: user.addresses.map((item) => ({ ...item, isDefault: item.id === id })) });
  }

  function logout() {
    localStorage.removeItem(SESSION);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, register, updateProfile, saveAddress, deleteAddress, setDefaultAddress, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired };
