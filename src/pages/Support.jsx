import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Mail, MapPin } from 'lucide-react';
import { Breadcrumbs, EmptyState, PageTitle } from '../components/StoreUI';
import { formatBDT } from '../utils/format';

const pages = {
  contact: ['Contact', 'Get help with an order, product or warranty question.'],
  faq: ['Frequently asked questions', 'Find answers on delivery, payments and returns.'],
  'shipping-returns': ['Shipping & returns', 'Delivery and replacement information for Bangladesh.'],
  warranty: ['Warranty', 'Check coverage and how to request support.'],
  privacy: ['Privacy policy', 'How this demo storefront uses browser storage.'],
  terms: ['Terms', 'Conditions of use for the demo storefront.'],
};

function Contact() {
  return <><p className="notice">Contact details carried over from the original storefront. Confirm availability before using them for live support.</p>
    <div className="contact-options"><a href="mailto:support@joymart.com.bd"><Mail size={21} /> support@joymart.com.bd</a><p><MapPin size={21} /> Gulshan-2, Dhaka 1212, Bangladesh</p></div>
    <p>For an order question, include the order reference and a short description.</p></>;
}

function Faq() {
  return <div className="faq-list">
    <details><summary>How much is standard delivery?</summary><p>Standard delivery costs {formatBDT(120)}. Orders over {formatBDT(10000)} qualify for free standard delivery.</p></details>
    <details><summary>Which payment methods can I select?</summary><p>Demo checkout uses the Cash on Delivery option and collects no money. bKash, Nagad and card payments require a live payment integration.</p></details>
    <details><summary>How can I find my demo order?</summary><p>Use your reference or checkout phone number on the <Link className="text-link" to="/track">Track order</Link> page in the browser where you placed it.</p></details>
    <details><summary>What if a gadget arrives defective?</summary><p>The original store describes a 7-day defective-item replacement policy. See <Link className="text-link" to="/support/shipping-returns">Shipping & returns</Link> for the current draft.</p></details>
  </div>;
}

export default function Support() {
  const { section } = useParams();
  if (!Object.hasOwn(pages, section)) return <EmptyState title="Support page unavailable" text="Visit the FAQ or contact Joy Mart for help." to="/support/faq" action="View frequently asked questions" />;
  const [title, subtitle] = pages[section];
  return <div className="container page">
    <Breadcrumbs items={[{ label: 'Support', to: '/support/faq' }, { label: title }]} />
    <PageTitle title={title} subtitle={subtitle} />
    <div className="support-layout">
      <nav className="panel account-nav" aria-label="Support pages">{Object.entries(pages).map(([id, [label]]) => <Link to={'/support/' + id} key={id} aria-current={id === section ? 'page' : undefined}>{label}</Link>)}</nav>
      <article className="panel policy">
        {section === 'contact' && <Contact />}
        {section === 'faq' && <Faq />}
        {section === 'shipping-returns' && <>
          <p className="notice">Draft for business review. Delivery and replacement terms come from the original storefront.</p>
          <h2>Delivery</h2><p>Joy Mart lists nationwide delivery at {formatBDT(120)}, with free standard delivery for orders over {formatBDT(10000)}. Demo estimates are 1–2 business days in Dhaka and 2–3 business days elsewhere, with a separate express option for Dhaka.</p>
          <h2>Defective-item replacement</h2><p>The original storefront advertises a 7-day replacement window for eligible defective items. Contact support with the order reference, product name and description of the issue. Eligibility, exclusions and return arrangements need business approval.</p></>}
        {section === 'warranty' && <>
          <p className="notice">Draft for business review. Product-specific warranty periods and exclusions require confirmation.</p>
          <h2>Brand warranty</h2><p>The original storefront describes official brand warranty coverage. Confirm the warranty provider, duration and terms for your product with Joy Mart support.</p>
          <h2>Request support</h2><p>Have the product name, serial number and proof of purchase available.</p></>}
        {section === 'privacy' && <>
          <p className="notice">Draft for business and legal review.</p>
          <h2>Data in this demo</h2><p>Cart items, preferences, recently viewed products, demo accounts, addresses and orders are stored in this browser. Clearing site data removes those records. Use sample details in demo forms.</p>
          <h2>External resources</h2><p>Some product photos load from Unsplash. A live privacy policy must cover the final services, retention periods and customer rights.</p></>}
        {section === 'terms' && <>
          <p className="notice">Draft for business and legal review.</p>
          <h2>Demo shopping</h2><p>Prices, inventory, delivery estimates and reviews are provided for demonstration. Placing a demo order creates a browser record. Sales, payment processing and fulfillment require a live store.</p>
          <h2>Store policies</h2><p>Review the <Link className="text-link" to="/support/shipping-returns">Shipping & returns</Link> and <Link className="text-link" to="/support/warranty">Warranty</Link> drafts for the existing store terms.</p></>}
        {section !== 'contact' && <Link className="button secondary page-action" to="/support/contact">Contact support <ArrowRight size={17} /></Link>}
      </article>
    </div>
  </div>;
}
