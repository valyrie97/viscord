// import migration from './migrations/1-chat-persistence.sql';

import { createConnection } from 'mysql';
import { readdirSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from '../constants';
const __dirname = dirname(fileURLToPath(import.meta.url));

const host = DB_HOST;
const user = DB_USER;
const password = DB_PASSWORD;
const database = DB_NAME;

interface Migration {
  sql: string;
  version: number;
}

const migrations: Migration[] =
  readdirSync(resolve(__dirname, 'migrations'))
  .sort((a, b) => {
    const an = Number(a.split('-')[0]);
    const bn = Number(b.split('-')[0]);
    return an > bn ? 1 : an < bn ? -1 : 0;
  })
  .map(path => {
    const fullpath = resolve(__dirname, 'migrations', path);
    const n = Number(path.split('-')[0]);
    return {
      sql: readFileSync(fullpath).toString(),
      version: n,
    };
  });

export const connection = createConnection({
  host,
  user,
  password,
  database,
});
const migrationConnection = createConnection({
  host,
  user,
  password,
  multipleStatements: true,
});

const connected: Promise<null> = new Promise((res, rej) => {
  migrationConnection.connect((err) => {
    if(err === null) {
      console.log('connected to database!');
      res(null);
    } else {
      console.error(err);
      rej(err);
    }
  });
});

export async function update() {
  // console.log(migrations);
  console.log('waiting for connection...');
  await connected;
  // determine version
  const currentVersion: number = await new Promise((resolve, rej) => {
    migrationConnection.query(`
      SELECT COUNT(*) as tables
        FROM information_schema.tables
        WHERE table_schema = '${database}';
    `, async (err, res, fields) => {
      if(res[0].tables === 0) {
        // await new Promise((resolve, reject) => {
        //   migrationConnection.query(`CREATE DATABASE \`${database}\` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;`, (err, res) => {
        //     if(err) return reject(err);
        //     return resolve(res);
        //   });
        // });
        resolve(0);
      } else {
        const version: number = await new Promise((resolve, reject) => {
          migrationConnection.query(`
            SELECT max(id) as 'version' FROM ${database}.migrations;
          `, function (err, results, fields) {
            resolve(results[0].version);
          });
        });
        resolve(version);
        // check the version table!
      }
    });
  });
  const expectedVersion = migrations.length;

  if(currentVersion >= expectedVersion) {
    console.log('database up to date!');
  } else {
    const difference = expectedVersion - currentVersion;
    console.log(`database ${difference} version${difference !== 1 ? 's' : ''} behind`);
    // console.log(`${currentVersion} >>> ${expectedVersion}`);
    const neededMigrations = migrations.filter(m => m.version > currentVersion);
    let completedMigrations = 0;
    for(const migration of neededMigrations) {
      console.log(`${currentVersion + completedMigrations} >>> ${migration.version}`);
      await new Promise((resolve, reject) => {
        migrationConnection.query(`
          USE \`${database}\`;
          ${migration.sql}
          INSERT INTO \`migrations\` ()
            VALUES ();
        `, (err, res) => {
          if(err !== null) return reject(err);
          console.log(`executed ${res.length} statement${res.length !== 0 ? 's' : ''}`);
          return resolve(void 0);
        });
      });
      completedMigrations ++;
    }
  }
  // console.log('database version:', currentVersion)

  // console.log(response);
}