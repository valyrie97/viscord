

export default function router(routes: any) {
  for(const routeName in routes) {
    const route = routes[routeName];
    if('routes' in route) {
      for(const suffix of route.routes) {
        const combinedRouteName = routeName + ':' + suffix;
        routes[combinedRouteName] = (_: never, ...args: any[]) => route(suffix, args);
      }
      delete routes[routeName];
    }
  }

  const sendFn = function(route: any, data: any) {
    if(route in routes) {
      return routes[route](data);
    } else {
      console.warn(`route <${route}> not found`);
      console.trace();
    }
  };
  
  sendFn.routes = Object.keys(routes);
  return sendFn;
}