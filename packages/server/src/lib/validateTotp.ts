import getToken from 'totp-generator';

export const validateTotp = (key: string, code: string) => {
  return [
    getToken(key, { timestamp: Date.now() }),
    getToken(key, { timestamp: Date.now() - 30 * 1000 }),
    getToken(key, { timestamp: Date.now() - 2 * 30 * 1000 })
  ].includes(code);
};
