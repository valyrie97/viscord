import * as preload from '#preload';
// console.log('#preload', preload);

function ls(key: string, value?: string) {
  if(value === undefined) {
    return localStorage.getItem(key);
  } else {
    localStorage.setItem(key, value);
  }
}

const functions: any = (function() {
  const electron = !!preload.versions;
  const cordova = 'cordova' in globalThis;

  if(electron) {
    return preload;
  } else {
    let cid: string | null = null;
    let homeServer: string | null = null;
    return {
      getClientId() {
        return ls('clientId');
      },
      setClientId(id: any) {
        ls('clientId', id);
      },
      getHomeServer() {
        return ls('homeServer');
      },
      setHomeServer(str: string) {
        ls('homeServer', str);
      },
      getSessionToken() {
        return ls('sessionToken');
      },
      setSessionToken(str: string) {
        ls('sessionToken', str);
      },
    };
  }
})();


// console.log('native functions loaded', functions);

export const getClientId = functions.getClientId;
export const setClientId = functions.setClientId;
export const getHomeServer = functions.getHomeServer;
export const setHomeServer = functions.setHomeServer;
export const getSessionToken = functions.getSessionToken;
export const setSessionToken = functions.setSessionToken;