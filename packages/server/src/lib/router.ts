export default function router(routes: any) {
  for(const routeName in routes) {
    const route = routes[routeName];
    if('routes' in route) {
      for(const suffix of route.routes) {
        const combinedRouteName = routeName + ':' + suffix;
        routes[combinedRouteName] = function(...args: any[]) {
          // console.log(suffix, route, data)
          return route(suffix, ...args);
          // console.log('INCOMMING', args)
        };
      }
      delete routes[routeName];
    }
  }

  const sendFn = function(route: any, ...args: any[]) {
    if(route in routes) {
      return routes[route](...args);
    } else {
      console.warn(`route <${route}> not found`);
      console.trace();
    }
  };
  
  sendFn.routes = Object.keys(routes);
  return sendFn;
}