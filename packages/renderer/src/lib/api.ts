


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
  });

  socket.addEventListener('message', (event) => {
    const {action, data} = JSON.parse(event.data);
    console.log('[IN]', action, data);
    const routeFound = routers
      .map(router => router(action, data))
      .reduce((a, b) => a + b, 0);
    if(routeFound === 0) {
      console.warn(`route <${action}> not found`);
    } else {
      console.log(`routed to ${routeFound} elements`);
    }
  });

  socket.addEventListener('close', () => {
    socket = null;
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
  return function(route: string, data: any) {
    if(route in routes) {
      routes[route](data);
      return true;
    } else {
      return false;
    }
  };
}

export function registerRouter(router: any) {
  routers.push(router);
}

export function unregisterRouter(router: any) {
  routers = routers.filter(r => r !== router);
}