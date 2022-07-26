import * as preload from '#preload';

console.log('#preload', preload);

const functions: any = (function() {
  const electron = !!preload.getClientId;
  const cordova = 'cordova' in globalThis;

  console.log(preload);

  // alert('Electron: ' + electron + '\nCordova: ' + cordova);

  if(electron) {
    return preload;
  } else {
    let cid: string | null = null;
    let homeServer: string | null = null;
    return {
      getClientId() {
        return cid;
      },
      setClientId(id: any) {
        cid = id;
      },
      getHomeServer() {
        return homeServer;
      },
      setHomeServer(str: string) {
        homeServer = str;
      }
    };
  }
})();


console.log('native functions loaded', functions);

export const getClientId = functions.getClientId;
export const setClientId = functions.setClientId;
export const getHomeServer = functions.getHomeServer;
export const setHomeServer = functions.setHomeServer;