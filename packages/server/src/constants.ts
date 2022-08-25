import { ensureDirSync } from 'fs-extra';
import { resolve } from 'path';

export const STORAGE_PATH = resolve('../../../storage');

export const DB_HOST = 'localhost';
export const DB_USER = 'root';
export const DB_PASSWORD = 'example';
export const DB_NAME = 'corner';



ensureDirSync(STORAGE_PATH);