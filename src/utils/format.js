// Currency formatter for Bangladeshi Taka (BDT)
export function formatBDT(amount) {
  if (amount === undefined || amount === null) return '৳0';
  return `৳${Number(amount).toLocaleString('en-US')}`;
}
