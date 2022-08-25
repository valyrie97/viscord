import query from "../db/query";
import addSessionToken from '../db/snippets/session/new.sql';
import { rb32 } from "../lib/rb32";

export const generateSessionToken = async (clientId: string) => {
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += rb32();
  }
  
  //           scnd   min  hr  day   year
  const year = 1000 * 60 * 60 * 24 * 365;
  const expiration = Date.now() + year;
  await query(addSessionToken, clientId, expiration, token);
  return token;
};
