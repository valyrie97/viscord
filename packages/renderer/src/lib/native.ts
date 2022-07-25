import * as preload from '#preload';

const functions: any = (function() {
  const electron = !!preload.getClientId;
  const cordova = 'cordova' in globalThis;

  console.log(preload);

  // alert('Electron: ' + electron + '\nCordova: ' + cordova);

  if(electron) {
    return preload;
  } else {
    let cid: any = null;
    return {
      getClientId() {
        return cid;
      },
      setClientId(id: any) {
        cid = id;
      },
    };
  }
})();


export const getClientId = functions.getClientId;
export const setClientId = functions.setClientId;