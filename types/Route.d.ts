export type RouteDataType = {
  method: string;
  response: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: Record<string, string>;
}
