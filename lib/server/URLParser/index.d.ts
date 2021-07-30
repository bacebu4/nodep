import { IncomingHttpHeaders } from 'http';

type UnknownObject = Record<string, unknown>;
type UnknownStringObject = Record<string, string | undefined>;

type Handler = (payload: {
  body: UnknownObject;
  params: UnknownStringObject;
  query: UnknownStringObject;
  headers: IncomingHttpHeaders;
}) => unknown;

interface Route {
  route: string;
  handler: Handler;
  method: string;
}

export class URLParser {
  query: UnknownStringObject;
  params: UnknownStringObject;
  handler: Handler;
  constructor(payload: {
    requestUrl: string;
    requestMethod: string;
    routes: Route[];
  });
}
