export default function router(routes: any) {
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
  return function(route: any, data: any) {
    if(route in routes) {
      routes[route](data);
    } else {
      console.warn(`route <${route}> not found`);
    }
  };
}