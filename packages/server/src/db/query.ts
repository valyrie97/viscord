import { connection } from './migrate';

export default function(sqlFile: any, ...args: any[]): Promise<any[] | null> {
  const b64 = sqlFile.split('base64,')[1];
  const text = Buffer.from(b64, 'base64').toString();
  return new Promise((resolve, reject) => {
    connection.query(text, [...args], (err, results) => {
      if(!err) return resolve(results);
      console.error(err.errno, err.sqlMessage);
      console.error('--- Query ---');
      console.error(err.sql?.substring(0, 10000));
      reject(err);
    });
  });
}