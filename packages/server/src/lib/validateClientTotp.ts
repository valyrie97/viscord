import query from '../db/query'
import getTotpKey from '../db/snippets/client/getTotpKeyByClientId.sql'
import { validateTotp } from './validateTotp';

export async function validateClientTotp(clientId: string, code: string) {
  const res = await query(getTotpKey, clientId);
  if(res === null || res.length !== 1) return false;
  return validateTotp(res[0].totp, code);
}