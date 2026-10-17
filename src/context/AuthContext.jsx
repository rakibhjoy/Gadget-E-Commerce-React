import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_USERS_KEY = 'joymart_users';
const CURRENT_USER_KEY = 'joymart_user';

const INITIAL_DEMO_USER = {
  name: 'Joy Ahmed',
  email: 'demo@joymart.com',
  password: 'password123',
  phone: '01711234567',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      recipientName: 'Joy Ahmed',
      phone: '01711234567',
      city: 'Dhaka',
      area: 'Gulshan-2',
      address: 'House 42, Road 11, Block D',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Office',
      recipientName: 'Joy Ahmed',
      phone: '01711234567',
      city: 'Dhaka',
      area: 'Banani',
      address: 'Plot 18, Kemal Ataturk Avenue',
      isDefault: false,
    },
  ],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Seed default demo user if not present
  useEffect(() => {
    try {
      const existingUsers = localStorage.getItem(DEMO_USERS_KEY);
      let users = existingUsers ? JSON.parse(existingUsers) : [];
      const hasJoyMart = users.some((u) => u.email === 'demo@joymart.com');
      if (!hasJoyMart) {
        users.push(INITIAL_DEMO_USER);
        localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
      }
    } catch (e) {
      console.error('Failed to initialize demo users database:', e);
    }
  }, []);

  const saveUserSession = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    // Also update in users database
    try {
      const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]');
      const idx = users.findIndex((u) => u.email.toLowerCase() === updatedUser.email.toLowerCase());
      if (idx > -1) {
        users[idx] = { ...users[idx], ...updatedUser };
        localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
      }
    } catch (e) {
      console.error('Failed to sync user database:', e);
    }
  };

  const login = (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]');
      const found = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );

      if (found) {
        const sessionUser = {
          name: found.name,
          email: found.email,
          phone: found.phone || '01700000000',
          avatar: found.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          addresses: found.addresses || [],
        };
        saveUserSession(sessionUser);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password.' };
      }
    } catch {
      return { success: false, error: 'Authentication failed. Please try again.' };
    }
  };

  const register = (name, email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]');
      const emailExists = users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (emailExists) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const newUser = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        addresses: [],
      };
      users.push(newUser);
      localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));

      const sessionUser = {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
        addresses: newUser.addresses,
      };
      saveUserSession(sessionUser);

      return { success: true };
    } catch {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const updateProfile = ({ name, phone, avatar }) => {
    if (!user) return;
    const updated = {
      ...user,
      name: name ?? user.name,
      phone: phone ?? user.phone,
      avatar: avatar ?? user.avatar,
    };
    saveUserSession(updated);
  };

  const addAddress = (newAddress) => {
    if (!user) return;
    const addr = {
      id: `addr-${Date.now()}`,
      isDefault: (user.addresses || []).length === 0,
      ...newAddress,
    };
    const updatedAddresses = [...(user.addresses || []), addr];
    const updatedUser = { ...user, addresses: updatedAddresses };
    saveUserSession(updatedUser);
    return addr;
  };

  const updateAddress = (id, updatedFields) => {
    if (!user) return;
    const updatedAddresses = (user.addresses || []).map((addr) =>
      addr.id === id ? { ...addr, ...updatedFields } : addr
    );
    saveUserSession({ ...user, addresses: updatedAddresses });
  };

  const deleteAddress = (id) => {
    if (!user) return;
    const remaining = (user.addresses || []).filter((addr) => addr.id !== id);
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      remaining[0].isDefault = true;
    }
    saveUserSession({ ...user, addresses: remaining });
  };

  const setDefaultAddress = (id) => {
    if (!user) return;
    const updatedAddresses = (user.addresses || []).map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    saveUserSession({ ...user, addresses: updatedAddresses });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
