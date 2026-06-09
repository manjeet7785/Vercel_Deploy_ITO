export const maskPhone = (phone) => {
  if (!phone || String(phone).length < 4) return 'XXXX';
  const value = String(phone);
  return value.substring(0, 2) + 'XXXXXX' + value.substring(value.length - 2);
};

export const maskEmail = (email) => {
  if (!email || !String(email).includes('@')) return 'xx****@domain.com';
  const [local, domain] = String(email).split('@');
  return local.substring(0, 2) + '****@' + domain;
};
