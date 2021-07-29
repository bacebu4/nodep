export class URLParser {
  query: Record<string, unknown>;
  params: Record<string, unknown>;
  matchingUrl: string;
  constructor(incomingUrl: string, givenUrls: string[]);
}
