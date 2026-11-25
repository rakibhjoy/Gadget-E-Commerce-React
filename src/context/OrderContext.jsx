import { useState } from 'react';
import PropTypes from 'prop-types';
import { OrderContext } from './storeContexts';
import { readList } from '../utils/storage';
import { normalizePhone, validPhone } from '../utils/commerce';

const ORDERS_KEY = 'joymart_orders';

function safeOrders() {
  return readList(ORDERS_KEY).filter((order) => typeof order?.id === 'string').map((order) => {
    const record = { ...order, isDemo: true };
    for (const field of ['status', 'courier', 'estimatedDelivery', 'timeline']) delete record[field];
    return record;
  });
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(safeOrders);

  function placeOrder(orderData) {
    const order = {
      ...orderData,
      id: 'JM-' + crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase(),
      date: new Date().toISOString(),
      isDemo: true,
    };
    const updated = [order, ...safeOrders()];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    setOrders(updated);
    return order;
  }

  function getOrder(identifier) {
    const value = (identifier ?? '').trim();
    if (!value) return null;
    return orders.find((order) => order.id.toUpperCase() === value.toUpperCase() ||
      (validPhone(value) && normalizePhone(order.customer?.phone) === normalizePhone(value))) ?? null;
  }

  function getUserOrders(email) {
    return orders.filter((order) => !order.customer?.isGuest && order.customer?.email?.toLowerCase() === email?.toLowerCase());
  }

  return <OrderContext.Provider value={{ orders, placeOrder, getOrder, getUserOrders }}>{children}</OrderContext.Provider>;
}

OrderProvider.propTypes = { children: PropTypes.node.isRequired };
