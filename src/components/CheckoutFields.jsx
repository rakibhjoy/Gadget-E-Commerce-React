import PropTypes from 'prop-types';
import { formatBDT } from '../utils/format';

export function AddressFields({ values = {}, label = false }) {
  return <div className="form-grid">
    {label && <label className="full">Address label<input name="label" required maxLength="45" placeholder="Home or Office" defaultValue={values.label} /></label>}
    <label>Recipient name<input name="recipientName" autoComplete="name" required minLength="2" maxLength="100" defaultValue={values.recipientName} /></label>
    <label>Mobile number<input name="phone" type="tel" autoComplete="tel" required maxLength="24" placeholder="01711234567" defaultValue={values.phone} /></label>
    <label>City or district<input name="city" autoComplete="address-level2" required minLength="2" maxLength="70" defaultValue={values.city} /></label>
    <label>Area or upazila<input name="area" autoComplete="address-level3" required minLength="2" maxLength="90" defaultValue={values.area} /></label>
    <label className="full">Street address<input name="address" autoComplete="street-address" required minLength="8" maxLength="200" placeholder="House, road and nearby landmark" defaultValue={values.address} /></label>
  </div>;
}

export function OrderTotals({ totals, coupon }) {
  return <dl className="order-totals">
    <div><dt>Subtotal</dt><dd>{formatBDT(totals.subtotal)}</dd></div>
    {totals.discount > 0 && <div><dt>Discount {coupon && '(' + coupon + ')'}</dt><dd className="discount">−{formatBDT(totals.discount)}</dd></div>}
    <div><dt>Delivery</dt><dd>{totals.shipping ? formatBDT(totals.shipping) : 'Free'}</dd></div>
    <div className="order-total"><dt>Total</dt><dd>{formatBDT(totals.total)}</dd></div>
  </dl>;
}

AddressFields.propTypes = { values: PropTypes.object, label: PropTypes.bool };
OrderTotals.propTypes = { totals: PropTypes.shape({ subtotal: PropTypes.number.isRequired, discount: PropTypes.number.isRequired, shipping: PropTypes.number.isRequired, total: PropTypes.number.isRequired }).isRequired, coupon: PropTypes.string };
