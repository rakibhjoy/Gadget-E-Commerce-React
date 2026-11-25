export function formatBDT(amount = 0) {
  return '\u09f3' + Number(amount ?? 0).toLocaleString('en-BD');
}
