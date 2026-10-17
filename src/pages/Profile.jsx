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
        <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-stone-500">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">Sign In Required</h2>
        <p className="mt-2 text-sm text-stone-500">
          Please sign in to view and manage your Joy Mart profile, saved delivery addresses, and order history.
        </p>
        <Link
          to="/login?redirect=/profile"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors"
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
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar with photo change trigger */}
            <div className="relative group">
              <img
                src={avatar || user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-stone-100 shadow-sm"
              />
              <button
                onClick={() => setShowAvatarPicker(true)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-stone-900 text-white rounded-lg shadow-sm hover:bg-stone-800 transition-transform active:scale-90"
                title="Change Profile Picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Joy Mart VIP
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">{user.email}</p>
              <p className="text-xs text-stone-600 mt-0.5">
                Mobile: <strong className="text-stone-900">{user.phone || 'Not added yet'}</strong>
              </p>
            </div>
          </div>

          {/* Quick Account Stats */}
          <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-stone-100 pt-4 sm:pt-0 sm:pl-8 text-center">
            <button
              type="button"
              onClick={() => switchTab('orders')}
              className="group hover:opacity-80 transition-opacity"
            >
              <span className="text-xl font-black text-stone-900 block group-hover:text-amber-600">
                {userOrders.length}
              </span>
              <span className="text-[11px] text-stone-400 group-hover:text-stone-700">Total Orders</span>
            </button>
            <button
              type="button"
              onClick={() => switchTab('addresses')}
              className="group hover:opacity-80 transition-opacity"
            >
              <span className="text-xl font-black text-stone-900 block group-hover:text-amber-600">
                {(user.addresses || []).length}
              </span>
              <span className="text-[11px] text-stone-400 group-hover:text-stone-700">Addresses</span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-stone-200 mb-8 overflow-x-auto no-scrollbar">
        <button
          id="tab-btn-profile"
          onClick={() => switchTab('profile')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-stone-900 text-stone-950'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          Profile Settings
        </button>

        <button
          id="tab-btn-addresses"
          onClick={() => switchTab('addresses')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'border-stone-900 text-stone-950'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <span>Delivery Addresses</span>
          <span className="w-5 h-5 rounded-full bg-stone-100 text-[10px] flex items-center justify-center font-bold">
            {(user.addresses || []).length}
          </span>
        </button>

        <button
          id="tab-btn-orders"
          onClick={() => switchTab('orders')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-stone-900 text-stone-950'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <span>My Orders & Shipments</span>
          <span className="w-5 h-5 rounded-full bg-stone-100 text-[10px] flex items-center justify-center font-bold">
            {userOrders.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Profile Edit */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-xs max-w-2xl">
          <h2 className="text-lg font-extrabold text-stone-900 mb-6">
            Personal Information
          </h2>

          {profileSaved && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Email Address (Account ID)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-100 border border-stone-200 rounded-xl text-stone-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Mobile Phone (Required for Express Dispatch)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="tel"
                  placeholder="e.g. 01711234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white"
                />
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Joy Express riders call this phone before arrival.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
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
              <h2 className="text-lg font-extrabold text-stone-900">
                Delivery Addresses
              </h2>
              <p className="text-xs text-stone-500">
                Manage your home, office, and regional Bangladesh delivery points
              </p>
            </div>
            <button
              onClick={() => handleOpenAddressModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(user.addresses || []).map((addr) => (
              <div
                key={addr.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                  addr.isDefault ? 'border-amber-500/80 ring-2 ring-amber-500/10' : 'border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800 uppercase tracking-wider">
                      {addr.label}
                    </span>
                    {addr.isDefault ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        Default Address
                      </span>
                    ) : (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[10px] font-bold text-stone-400 hover:text-stone-900"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-stone-900">
                    {addr.recipientName || user.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Phone: {addr.phone || user.phone}
                  </p>
                  <p className="text-xs text-stone-700 mt-2 font-medium">
                    {addr.address}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {addr.area}, {addr.city}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleOpenAddressModal(addr)}
                    className="inline-flex items-center gap-1 font-bold text-stone-700 hover:text-stone-950"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="inline-flex items-center gap-1 font-medium text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}

            {(!user.addresses || user.addresses.length === 0) && (
              <div className="col-span-full py-12 text-center bg-white border border-dashed border-stone-300 rounded-3xl">
                <MapPin className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-stone-900">No saved addresses</h3>
                <p className="text-xs text-stone-500 mt-1">Add your shipping details for fast 1-click checkout.</p>
                <button
                  onClick={() => handleOpenAddressModal()}
                  className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
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
            <h2 className="text-lg font-extrabold text-stone-900">
              Orders & Parcel Tracking
            </h2>
            <p className="text-xs text-stone-500">
              Track live shipment statuses, courier details, and receipts
            </p>
          </div>

          <div className="space-y-4">
            {userOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-extrabold text-sm text-stone-900">{ord.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Placed on {ord.date} • {ord.paymentMethod}
                  </p>
                  <p className="text-xs text-stone-700 mt-1">
                    Destination: <strong>{ord.deliveryAddress?.area}, {ord.deliveryAddress?.city}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Total</span>
                    <span className="text-base font-black text-stone-900">
                      {formatBDT(ord.total)}
                    </span>
                  </div>

                  <Link
                    to={`/track?id=${ord.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Track Parcel</span>
                  </Link>
                </div>
              </div>
            ))}

            {userOrders.length === 0 && (
              <div className="py-16 text-center bg-white border border-dashed border-stone-300 rounded-3xl">
                <Package className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-stone-900">No orders placed yet</h3>
                <p className="text-xs text-stone-500 mt-1">Explore our catalog and make your first Joy Mart order.</p>
                <Link
                  to="/products"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
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
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowAvatarPicker(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-stone-900 mb-2">
              Update Profile Picture
            </h3>
            <p className="text-xs text-stone-500 mb-5">
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
                    avatar === pAvatar ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img src={pAvatar} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Or Upload from Device:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleAvatarFileUpload(e);
                  setShowAvatarPicker(false);
                }}
                className="text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-stone-800 hover:file:bg-stone-200 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Address Edit/Add Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setAddressModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-stone-900 mb-1">
              {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Enter precise delivery destination inside Bangladesh for courier dispatch
            </p>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Address Label
                  </label>
                  <select
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Studio">Studio</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    District / City
                  </label>
                  <select
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
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
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.recipientName}
                    onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                    placeholder="Full name"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Thana / Area
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.area}
                  onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                  placeholder="e.g. Gulshan-2, Banani, Dhanmondi, Uttara"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Street Address & Landmark
                </label>
                <textarea
                  required
                  rows={2}
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  placeholder="House number, road number, flat/apt details..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-xs"
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
