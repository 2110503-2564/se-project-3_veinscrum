export function getDynamicRoute<T extends Record<string, string>>(
  route: T,
): RouteHandlers<T> {
  return Object.fromEntries(
    Object.entries(route).map(([key, value]) => {
      if (!value.includes("{")) return [key, value];

      return [
        key,
        (params: Record<string, string>) => {
          return Object.entries(params).reduce((acc, [k, v]) => {
            return acc.replace(`{${k}}`, v);
          }, value as string);
        },
      ];
    }),
  );
}
