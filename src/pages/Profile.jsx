import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Camera,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Package,
  ArrowRight,
  ShieldCheck,
  Star,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { formatBDT } from '../utils/format';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
];

export default function Profile() {
  const { user, updateProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress, logout } = useAuth();
  const { getUserOrders } = useOrders();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'profile');

  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab && ['profile', 'addresses', 'orders'].includes(currentTab)) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  const switchTab = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };
  
  // Profile edit state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || PRESET_AVATARS[0]);
  const [profileSaved, setProfileSaved] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Address modal state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    recipientName: user?.name || '',
    phone: user?.phone || '',
    city: 'Dhaka',
    area: '',
    address: '',
  });

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-accent-soft rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent border border-accent/20">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-primary-text">Sign In Required</h2>
        <p className="mt-2 text-sm text-muted">
          Please sign in to view and manage your Joy Mart profile, saved delivery addresses, and order history.
        </p>
        <Link
          to="/login?redirect=/profile"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <span>Sign In to Account</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const userOrders = getUserOrders(user.email, user.phone);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({ name, phone, avatar });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddressModal = (addr = null) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setAddressForm({
        label: addr.label,
        recipientName: addr.recipientName || user.name,
        phone: addr.phone || user.phone,
        city: addr.city,
        area: addr.area,
        address: addr.address,
      });
    } else {
      setEditingAddressId(null);
      setAddressForm({
        label: 'Home',
        recipientName: user.name,
        phone: user.phone,
        city: 'Dhaka',
        area: '',
        address: '',
      });
    }
    setAddressModalOpen(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (editingAddressId) {
      updateAddress(editingAddressId, addressForm);
    } else {
      addAddress(addressForm);
    }
    setAddressModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Top Profile Summary Card */}
      <div className="glass rounded-3xl p-6 sm:p-8 shadow-glass border border-border/80 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar with photo change trigger */}
            <div className="relative group">
              <img
                src={avatar || user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-accent-soft shadow-sm"
              />
              <button
                onClick={() => setShowAvatarPicker(true)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-accent hover:bg-accent-hover text-white rounded-lg shadow-sm transition-transform active:scale-90"
                title="Change Profile Picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-black text-primary-text tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-soft text-accent border border-accent/20">
                  Joy Mart VIP
                </span>
              </div>
              <p className="text-xs text-muted mt-1">{user.email}</p>
              <p className="text-xs text-primary-text/80 mt-0.5">
                Mobile: <strong className="text-primary-text">{user.phone || 'Not added yet'}</strong>
              </p>
            </div>
          </div>

          {/* Quick Account Stats */}
          <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-border/60 pt-4 sm:pt-0 sm:pl-8 text-center">
            <button
              type="button"
              onClick={() => switchTab('orders')}
              className="group hover:opacity-80 transition-opacity"
            >
              <span className="text-xl font-black text-primary-text block group-hover:text-accent transition-colors">
                {userOrders.length}
              </span>
              <span className="text-[11px] text-muted group-hover:text-primary-text transition-colors">Total Orders</span>
            </button>
            <button
              type="button"
              onClick={() => switchTab('addresses')}
              className="group hover:opacity-80 transition-opacity"
            >
              <span className="text-xl font-black text-primary-text block group-hover:text-accent transition-colors">
                {(user.addresses || []).length}
              </span>
              <span className="text-[11px] text-muted group-hover:text-primary-text transition-colors">Addresses</span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-sale hover:bg-sale/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-border mb-8 overflow-x-auto no-scrollbar">
        <button
          id="tab-btn-profile"
          onClick={() => switchTab('profile')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:text-primary-text'
          }`}
        >
          Profile Settings
        </button>

        <button
          id="tab-btn-addresses"
          onClick={() => switchTab('addresses')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:text-primary-text'
          }`}
        >
          <span>Delivery Addresses</span>
          <span className="w-5 h-5 rounded-full bg-accent-soft text-accent text-[10px] flex items-center justify-center font-bold">
            {(user.addresses || []).length}
          </span>
        </button>

        <button
          id="tab-btn-orders"
          onClick={() => switchTab('orders')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:text-primary-text'
          }`}
        >
          <span>My Orders & Shipments</span>
          <span className="w-5 h-5 rounded-full bg-accent-soft text-accent text-[10px] flex items-center justify-center font-bold">
            {userOrders.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Profile Edit */}
      {activeTab === 'profile' && (
        <div className="glass rounded-3xl p-6 sm:p-10 shadow-glass border border-border/80 max-w-2xl">
          <h2 className="text-lg font-extrabold text-primary-text mb-6">
            Personal Information
          </h2>

          {profileSaved && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-success/30 text-success text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-primary-text mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-secondary-bg/50 border border-border rounded-xl focus:outline-none focus:border-accent focus:bg-white transition-all text-primary-text"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary-text mb-1.5">
                Email Address (Account ID)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-secondary-bg/80 border border-border rounded-xl text-muted cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary-text mb-1.5">
                Mobile Phone (Required for Express Dispatch)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="tel"
                  placeholder="e.g. 01711234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-secondary-bg/50 border border-border rounded-xl focus:outline-none focus:border-accent focus:bg-white transition-all text-primary-text"
                />
              </div>
              <span className="text-[11px] text-muted mt-1 block">
                Joy Express riders call this phone before arrival.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Addresses Manager */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-primary-text">
                Delivery Addresses
              </h2>
              <p className="text-xs text-muted">
                Manage your home, office, and regional Bangladesh delivery points
              </p>
            </div>
            <button
              onClick={() => handleOpenAddressModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(user.addresses || []).map((addr) => (
              <div
                key={addr.id}
                className={`glass rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                  addr.isDefault ? 'border-accent ring-2 ring-accent/20' : 'border-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary-bg text-primary-text uppercase tracking-wider border border-border/60">
                      {addr.label}
                    </span>
                    {addr.isDefault ? (
                      <span className="text-[10px] font-bold text-accent bg-accent-soft px-2 py-0.5 rounded-full border border-accent/20">
                        Default Address
                      </span>
                    ) : (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[10px] font-bold text-muted hover:text-accent transition-colors"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-primary-text">
                    {addr.recipientName || user.name}
                  </h3>
                  <p className="text-xs text-primary-text/80 mt-1">
                    Phone: {addr.phone || user.phone}
                  </p>
                  <p className="text-xs text-primary-text/90 mt-2 font-medium">
                    {addr.address}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {addr.area}, {addr.city}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleOpenAddressModal(addr)}
                    className="inline-flex items-center gap-1 font-bold text-primary-text hover:text-accent transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="inline-flex items-center gap-1 font-medium text-sale hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}

            {(!user.addresses || user.addresses.length === 0) && (
              <div className="col-span-full py-12 text-center glass border border-dashed border-border rounded-3xl">
                <MapPin className="w-8 h-8 text-muted mx-auto mb-2" />
                <h3 className="font-bold text-sm text-primary-text">No saved addresses</h3>
                <p className="text-xs text-muted mt-1">Add your shipping details for fast 1-click checkout.</p>
                <button
                  onClick={() => handleOpenAddressModal()}
                  className="mt-4 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Add First Address
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: User Orders List */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-primary-text">
              Orders & Parcel Tracking
            </h2>
            <p className="text-xs text-muted">
              Track live shipment statuses, courier details, and receipts
            </p>
          </div>

          <div className="space-y-4">
            {userOrders.map((ord) => (
              <div
                key={ord.id}
                className="glass rounded-2xl p-5 sm:p-6 shadow-xs border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-extrabold text-sm text-primary-text">{ord.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-soft text-accent border border-accent/20">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted">
                    Placed on {ord.date} • {ord.paymentMethod}
                  </p>
                  <p className="text-xs text-primary-text/80 mt-1">
                    Destination: <strong className="text-primary-text">{ord.deliveryAddress?.area}, {ord.deliveryAddress?.city}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-xs text-muted block">Total</span>
                    <span className="text-base font-black text-primary-text">
                      {formatBDT(ord.total)}
                    </span>
                  </div>

                  <Link
                    to={`/track?id=${ord.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-text hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Track Parcel</span>
                  </Link>
                </div>
              </div>
            ))}

            {userOrders.length === 0 && (
              <div className="py-16 text-center glass border border-dashed border-border rounded-3xl">
                <Package className="w-10 h-10 text-muted mx-auto mb-2" />
                <h3 className="font-bold text-sm text-primary-text">No orders placed yet</h3>
                <p className="text-xs text-muted mt-1">Explore our catalog and make your first Joy Mart order.</p>
                <Link
                  to="/products"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <span>Explore Gadgets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Picture Change Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 bg-primary-text/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-strong rounded-3xl max-w-md w-full p-6 shadow-2xl border border-border relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowAvatarPicker(false)}
              className="absolute top-4 right-4 p-1.5 text-muted hover:text-primary-text rounded-full hover:bg-secondary-bg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-primary-text mb-2">
              Update Profile Picture
            </h3>
            <p className="text-xs text-muted mb-5">
              Select one of our luxury avatars or upload your custom photo.
            </p>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {PRESET_AVATARS.map((pAvatar, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAvatar(pAvatar);
                    updateProfile({ avatar: pAvatar });
                    setShowAvatarPicker(false);
                  }}
                  className={`rounded-2xl overflow-hidden border-2 transition-all aspect-square ${
                    avatar === pAvatar ? 'border-accent ring-2 ring-accent/30' : 'border-border hover:border-accent/50'
                  }`}
                >
                  <img src={pAvatar} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-border/60">
              <label className="block text-xs font-bold text-primary-text mb-2">
                Or Upload from Device:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleAvatarFileUpload(e);
                  setShowAvatarPicker(false);
                }}
                className="text-xs text-muted file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-accent-soft file:text-accent hover:file:bg-accent hover:file:text-white transition-colors cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Address Edit/Add Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary-text/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-strong rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-border relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setAddressModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-muted hover:text-primary-text rounded-full hover:bg-secondary-bg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-primary-text mb-1">
              {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
            </h3>
            <p className="text-xs text-muted mb-6">
              Enter precise delivery destination inside Bangladesh for courier dispatch
            </p>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-primary-text mb-1">
                    Address Label
                  </label>
                  <select
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-secondary-bg/60 border border-border rounded-xl focus:outline-none focus:border-accent text-primary-text"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Studio">Studio</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-text mb-1">
                    District / City
                  </label>
                  <select
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-secondary-bg/60 border border-border rounded-xl focus:outline-none focus:border-accent text-primary-text"
                  >
                    <option value="Dhaka">Dhaka (24h Express)</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-primary-text mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.recipientName}
                    onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                    placeholder="Full name"
                    className="w-full px-3 py-2 text-xs bg-secondary-bg/60 border border-border rounded-xl focus:outline-none focus:border-accent text-primary-text"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-text mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 text-xs bg-secondary-bg/60 border border-border rounded-xl focus:outline-none focus:border-accent text-primary-text"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-text mb-1">
                  Thana / Area
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.area}
                  onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                  placeholder="e.g. Gulshan-2, Banani, Dhanmondi, Uttara"
                  className="w-full px-3 py-2 text-xs bg-secondary-bg/60 border border-border rounded-xl focus:outline-none focus:border-accent text-primary-text"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-text mb-1">
                  Full Street Address & Landmark
                </label>
                <textarea
                  required
                  rows={2}
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  placeholder="House number, road number, flat/apt details..."
                  className="w-full px-3 py-2 text-xs bg-secondary-bg/60 border border-border rounded-xl focus:outline-none focus:border-accent text-primary-text"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 border border-border text-primary-text rounded-xl text-xs font-semibold hover:bg-secondary-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
