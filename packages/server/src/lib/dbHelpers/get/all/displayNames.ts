import sql from './displayNames.sql';
import query from '/@/db/query';

export default function() {
  return query(sql)
}