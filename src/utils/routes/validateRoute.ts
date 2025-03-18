/**
 * Validates the given pathname against the defined routes.
 * @param path The pathname to validate.
 * @param routes The object containing defined routes.
 * @returns true if the route is valid; otherwise, false.
 */

export function validateRoute(
  path: string,
  routes: Record<string, string | ((params: Record<string, string>) => string)>,
): boolean {
  return Object.values(routes).some((route) => {
    if (typeof route === "string") {
      const dynamicRoutePattern = route
        .replace(/\{\w+\}/g, "([^/]+)")
        .replace(/\//g, "\\/");

      const dynamicRouteRegex = new RegExp(`^${dynamicRoutePattern}$`);
      return dynamicRouteRegex.test(path);
    }

    if (typeof route === "function") {
      const dynamicRoutePattern = route({})
        .replace(/\{\w+\}/g, "([^/]+)")
        .replace(/\//g, "\\/");

      const dynamicRouteRegex = new RegExp(`^${dynamicRoutePattern}$`);
      return dynamicRouteRegex.test(path);
    }

    return false;
  });
}
