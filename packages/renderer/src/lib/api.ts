


let socket: WebSocket | null = null;
let connectionAttempts = 0;
const url = 'wss://dev.valnet.xyz';

let routers: any[] = [];

const connect = async () => {
  try {
    connectionAttempts ++;
    console.log('attempting api connection...');
    socket = new WebSocket(url);
  } catch (e) {
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
    // socket.send('Hello Server!');
    console.log('API Connected');
  });

  socket.addEventListener('message', (event) => {
    console.log('API Broadcasted', event.data);
    const {action, data} = JSON.parse(event.data);
    for(const router of routers) {
      // debugger;
      router(action, data);
    }
  });

  socket.addEventListener('close', () => {
    socket = null;
    console.log('API Closed');
    connect();
  });
};

connect();

export async function send(action: string, data?: any) {
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

export function router(routes: any) {
  for(const routeName in routes) {
    const route = routes[routeName];
    if(typeof route === 'object') {
      for(const suffix in route) {
        const combinedRouteName = routeName + ':' + suffix;
        routes[combinedRouteName] = route[suffix];
      }
      delete routes[routeName];
    }
  }
  return function(route: string, data: any) {
    if(route in routes) {
      routes[route](data);
    } else {
      console.warn(`route <${route}> not found`);
    }
  };
}

export function registerRouter(router: any) {
  routers.push(router);
}

export function unregisterRouter(router: any) {
  routers = routers.filter(r => r !== router);
}