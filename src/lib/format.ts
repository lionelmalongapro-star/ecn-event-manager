const MONTHS_FR = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FR_LONG = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const MONTHS_EN_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function formatDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = locale === "fr" ? MONTHS_FR : MONTHS_EN;
  return `${day} ${months[d.getMonth()]}`;
}

export function formatDateLong(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = locale === "fr" ? MONTHS_FR_LONG : MONTHS_EN_LONG;
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateTime(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = locale === "fr" ? MONTHS_FR : MONTHS_EN;
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${day} ${months[d.getMonth()]} ${hours}:${minutes}`;
}

export function formatCurrency(amount: number): string {
  const formatted = amount.toLocaleString("fr-FR");
  return `${formatted} €`;
}
