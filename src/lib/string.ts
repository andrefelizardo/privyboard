export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatWalletAddress(address: string) {
  if (address.length <= 10) return address;
  const firstPart = address.slice(0, 5);
  const lastPart = address.slice(-4);
  return `${firstPart}...${lastPart}`;
}
