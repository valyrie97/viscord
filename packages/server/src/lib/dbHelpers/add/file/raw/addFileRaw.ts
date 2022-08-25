import query from "/@/db/query";
import sql from './addFileRaw.sql';

export default function addFile(uid: string, author: string, data: Buffer, type: string) {
  const now = new Date().getTime();
  return query(sql, uid, author, type, data, now, now);
}