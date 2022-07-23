import { resolve } from 'path';
import {
  writeFileSync,
  readFileSync,
  mkdirSync,
  existsSync,
} from 'fs';

const appdataPath = process.env.APPDATA || // windows
  (process.platform == 'darwin' ?
  process.env.HOME + '/Library/Preferences' : //macos
  process.env.HOME + '/.local/share'); // linux

const cornerDataPath = resolve(appdataPath, 'corner');
const clientIdPath = resolve(cornerDataPath, 'clientId');

// --- setup ---

if(!existsSync(cornerDataPath))
  mkdirSync(cornerDataPath);
if(!existsSync(clientIdPath))
  writeFileSync(clientIdPath, '');

// --- helpers ---

function validUuid(uuid: string) {
  return uuid.length === 36;
}

// --- export ---

export function getClientId() {
  const fileContents = readFileSync(clientIdPath).toString();
  if(!validUuid(fileContents)) return null;
  return fileContents;
}

export function setClientId(id: string) {
  if(!validUuid(id)) return false;
  writeFileSync(clientIdPath, id);
  return true;
}