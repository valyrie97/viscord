import { resolve } from 'path';
import {
  writeFileSync,
  readFileSync,
  mkdirSync,
  existsSync,
} from 'fs';
import { URL } from 'url';

const appdataPath = process.env.APPDATA || // windows
  (process.platform == 'darwin' ?
  process.env.HOME + '/Library/Preferences' : //macos
  process.env.HOME + '/.local/share'); // linux

const cornerDataPath = resolve(appdataPath, 'corner');
const clientIdPath = resolve(cornerDataPath, 'clientId');
const homeServerPath = resolve(cornerDataPath, 'homeServer');

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

export function getHomeServer() {
  const url = readFileSync(homeServerPath).toString()
  try {
    new URL(url);
    return url;
  } catch(e) {
    return null;
  }
}

export function setHomeServer(url: string) {
  if(url === null) {
    writeFileSync(homeServerPath, '');
    return null
  }
  writeFileSync(homeServerPath, url);
}