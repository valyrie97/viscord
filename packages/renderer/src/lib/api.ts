
export function connectApi(url: string) {
  let socket: WebSocket | null = null;
  let connectionAttempts = 0;
  let destroy = false;
  let routers: any[] = [];
  
  const connect = async () => {
    try {
      connectionAttempts ++;
      socket = new WebSocket(url);
    } catch (e) {
      if(destroy) return;
      if(connectionAttempts === 1)
        connect();
      else {
        const seconds = 2 ** connectionAttempts;
        console.log(`waiting ${seconds} seconds before reconnecting`);
        setTimeout(connect, 1000 * seconds);
      }
      return;
    }
  
    socket.addEventListener('open', () => {
      if(socket === null) return;
      connectionAttempts = 0;
      console.log('connected to', url);
      // socket.send('Hello Server!');
    });
  
    socket.addEventListener('message', (event) => {
      const {action, data} = JSON.parse(event.data);
      // console.debug('[IN]', action, data);
      const routeFound = routers
        .map(router => router(action, data))
        .reduce((a, b) => a + b, 0);
      if(routeFound === 0) {
        console.warn(`route <${action}> not found`);
      }
    });
  
    socket.addEventListener('close', () => {
      if(destroy) return;
      socket = null;
      connect();
    });
  };
  
  connect();
  
  async function send(action: string, data?: any) {
    if(socket === null) return;
    if(socket && socket.readyState === socket.CONNECTING) {
      try {
        await new Promise((resolve, reject) => {
          socket?.addEventListener('open', resolve);
          socket?.addEventListener('close', reject);
        });
      } catch(e) {
        return;
      }
      if(socket.readyState !== socket.OPEN) return;
    }
    const message = JSON.stringify({ action, data });
    socket.send(message);
  }
  
  function registerRouter(router: any) {
    routers.push(router);
  }
  
  function unregisterRouter(router: any) {
    routers = routers.filter(r => r !== router);
  }

  function close() {
    destroy = true;
    if(socket) {
      socket.close();
    }
  }

  return {
    registerRouter,
    unregisterRouter,
    send,
    destroy: close
  }
}

export interface RouterObject {
  [route: string]: (data: any) => void
}

export type Router = (route: string, data: any) => boolean

export function router(routes: RouterObject): Router {
  return function(route: string, data: any) {
    if(route in routes) {
      routes[route](data);
      return true;
    } else {
      return false;
    }
  };
}