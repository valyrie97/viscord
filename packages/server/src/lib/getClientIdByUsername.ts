import query from '../db/query'
import getByUsername from '../db/snippets/client/getByUsername.sql'

export async function getClientIdByUsername(username: string) {
  const res = await query(getByUsername, username);
  if(res === null || res.length !== 1) return null;
  return res[0].uid;
}