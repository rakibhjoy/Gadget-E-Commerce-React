import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

const ORDERS_STORAGE_KEY = 'joymart_orders';

const DEFAULT_ORDERS = [
  {
    id: 'JM-849201',
    date: '16 Oct 2026, 04:15 PM',
    customer: {
      name: 'Joy Ahmed',
      phone: '01711234567',
      email: 'demo@joymart.com',
      isGuest: false,
    },
    deliveryAddress: {
      label: 'Home',
      city: 'Dhaka',
      area: 'Gulshan-2',
      address: 'House 42, Road 11, Block D',
    },
    paymentMethod: 'Cash on Delivery',
    subtotal: 135000,
    shipping: 0,
    total: 135000,
    status: 'Out for Delivery',
    courier: 'Joy Express Priority Hub',
    estimatedDelivery: 'Today within 6:00 PM',
    items: [
      {
        product: {
          id: 'phone-zenith-1',
          name: 'JoyPhone Pro Max Titanium',
          price: 135000,
          category: 'Smartphones',
          image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
        },
        quantity: 1,
      },
    ],
    timeline: [
      { step: 'Order Placed & Verified', time: '16 Oct, 04:15 PM', completed: true },
      { step: 'Quality Checked & Packed in Dhaka Hub', time: '16 Oct, 07:30 PM', completed: true },
      { step: 'Dispatched with Joy Express Courier', time: '17 Oct, 08:30 AM', completed: true },
      { step: 'Out for Delivery with Courier Rider', time: '17 Oct, 11:00 AM', completed: true, current: true },
      { step: 'Delivered & Handed to Recipient', time: 'Expected by 6:00 PM', completed: false },
    ],
  },
];

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders:', e);
    }
  }, [orders]);

  const placeOrder = (orderData) => {
    const newOrder = {
      id: `JM-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Processing',
      courier: 'Joy Express Bangladesh',
      estimatedDelivery: orderData.deliveryAddress?.city === 'Dhaka' ? 'Within 24 Hours' : 'Within 48-72 Hours',
      timeline: [
        { step: 'Order Placed & Verified', time: 'Just now', completed: true, current: true },
        { step: 'Quality Checked & Packed at Central Hub', time: 'Pending', completed: false },
        { step: 'Dispatched with Courier Logistics', time: 'Pending', completed: false },
        { step: 'Out for Delivery to Your Address', time: 'Pending', completed: false },
        { step: 'Delivered', time: 'Pending', completed: false },
      ],
      ...orderData,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrder = (identifier) => {
    if (!identifier) return null;
    const cleanId = identifier.trim().toUpperCase();
    const cleanPhone = identifier.trim().replace(/[^0-9]/g, '');

    return (
      orders.find(
        (o) =>
          o.id.toUpperCase() === cleanId ||
          (cleanPhone.length >= 10 && o.customer?.phone?.replace(/[^0-9]/g, '').includes(cleanPhone))
      ) || null
    );
  };

  const getUserOrders = (email, phone) => {
    return orders.filter(
      (o) =>
        (email && o.customer?.email?.toLowerCase() === email.toLowerCase()) ||
        (phone && o.customer?.phone === phone)
    );
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrder, getUserOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
