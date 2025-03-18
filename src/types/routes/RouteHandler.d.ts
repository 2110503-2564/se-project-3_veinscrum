type ExtractRouteParams<T extends string> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer _Start}{${infer Param}}${infer Rest}`
    ? { [K in Param]: string } & ExtractRouteParams<Rest>
    : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {};

type RouteHandlers<T extends Record<string, string | Record<string, unknown>>> =
  {
    [K in keyof T]: T[K] extends string
      ? keyof ExtractRouteParams<T[K]> extends never
        ? string
        : (params: ExtractRouteParams<T[K]>) => string
      : T[K] extends Record<string, string | Record<string, unknown>>
        ? RouteHandlers<T[K]>
        : never;
  };
