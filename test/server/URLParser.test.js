'use strict';

const { URLParser } = require('../../lib/server/URLParser');

const firstHandler = () => {};
const secondHandler = () => {};
const thirdHandler = () => {};

const routes = [
  {
    path: 'id/:key/update',
    handle: firstHandler,
    method: 'GET',
  },
  {
    path: '/id/:key/create',
    handle: secondHandler,
    method: 'POST',
  },
  {
    path: 'users/update',
    handle: thirdHandler,
    method: 'PUT',
  },
];

describe('URLParser', () => {
  it('works', () => {
    const requestUrl = '/users/update';
    const [error, parsedUrl] = URLParser.from({
      requestUrl,
      requestMethod: 'PUT',
      routes,
    });

    const parsedUrlExpected = { params: {}, query: {}, handler: thirdHandler };
    expect(parsedUrlExpected).toStrictEqual(parsedUrl);
    expect(error).toBe(null);
  });

  it('parsing query', () => {
    const requestUrl = '/users/update?id=1&name=john';
    const [error, parsedUrl] = URLParser.from({
      requestUrl,
      requestMethod: 'PUT',
      routes,
    });

    const parsedUrlExpected = {
      params: {},
      query: { id: '1', name: 'john' },
      handler: thirdHandler,
    };

    expect(parsedUrlExpected).toStrictEqual(parsedUrl);
    expect(error).toBe(null);
  });

  it('parsing params', () => {
    const KEY = '123';
    const requestUrl = `id/${KEY}/create`;
    const [error, parsedUrl] = URLParser.from({
      requestUrl,
      requestMethod: 'POST',
      routes,
    });

    const parsedUrlExpected = {
      params: { key: KEY },
      query: {},
      handler: secondHandler,
    };

    expect(parsedUrlExpected).toStrictEqual(parsedUrl);
    expect(error).toBe(null);
  });

  it('returns an error flag when path is the same but method is different', () => {
    const requestUrl = 'users/update';
    const [error] = URLParser.from({
      requestUrl,
      requestMethod: 'POST',
      routes,
    });

    expect(error).toBe(true);
  });

  it('returns an error flag when no url found', () => {
    const requestUrl = 'users/updated';
    const [error] = URLParser.from({
      requestUrl,
      requestMethod: 'PUT',
      routes,
    });

    expect(error).toBe(true);
  });
});
