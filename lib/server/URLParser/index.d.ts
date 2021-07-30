import { IncomingHttpHeaders } from 'http';

type UnknownObject = Record<string, unknown>;

type Handler = (payload: {
  body: UnknownObject;
  params: UnknownObject;
  query: UnknownObject;
  headers: IncomingHttpHeaders;
}) => unknown;

interface Route {
  route: string;
  handler: Handler;
  method: string;
}

export class URLParser {
  query: UnknownObject;
  params: UnknownObject;
  handler: Handler;
  constructor(requestUrl: string, requestMethod: string, routes: Route[]);
}
