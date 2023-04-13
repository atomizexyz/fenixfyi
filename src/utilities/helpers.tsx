export const UTC_TIME = new Date().getTime() / 1000;

export const truncateAddress = (address: string) => {
  if (address == undefined) return "";
  return `${address.slice(0, 6)}•••${address.slice(-4)}`;
};

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const daysSince = (date: number) => {
  return Math.floor((UTC_TIME - date) / 86400);
};
