import sql from './uid.sql';
import query from '/@/db/query';

export default async function getFileByUid(uid: string) {
  return ((await query(sql, uid)) ?? [])[0];
}