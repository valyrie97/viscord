import { connection } from './migrate';




export default async function(a: any, ...opts: any[]): Promise<any[] | null> {
  const b64 = a.split('base64,')[1];
  const text = Buffer.from(b64, 'base64').toString();
  try {
    return await new Promise((resolve, reject) => {
      connection.query(text, [...opts], (err, results) => {
        if(!err) return resolve(results);
        console.error(err.errno, err.sqlMessage);
        console.error('--- Query ---');
        console.error(err.sql);
        reject(err);
      });
    });
  } catch(e) {
    return null;
  }
  // console.log(...opts)
}