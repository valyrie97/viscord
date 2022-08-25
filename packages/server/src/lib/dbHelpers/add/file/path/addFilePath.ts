import query from "/@/db/query";
import sql from './addFilePath.sql';

export default function addFile(uid: string, author: string, type: string) {
  const now = new Date().getTime();
  return query(sql, uid, author, type, now, now);
}