export const money = (value: number): string =>
  value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const initials = (name: string): string =>
  name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
