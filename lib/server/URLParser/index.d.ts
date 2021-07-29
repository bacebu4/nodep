import { IncomingHttpHeaders } from 'http';

type UnknownObject = Record<string, unknown>;

interface Route {
  route: string;
  handler: (payload: {
    body: UnknownObject;
    params: UnknownObject;
    query: UnknownObject;
    headers: IncomingHttpHeaders;
  }) => unknown;
}

export class URLParser {
  query: UnknownObject;
  params: UnknownObject;
  matchingUrl: string;
  constructor(incomingUrl: string, givenUrls: string[]);
}
