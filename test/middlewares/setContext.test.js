const setContext = require('../../lib/middlewares/setContext');

function setup() {
  const originalUrl = '/originalUrl';
  const protocol = 'http';
  const get = jest.fn().mockImplementation(param => param)
  const subdomainsEmpty = [];
  const subdomainsWww = ['www'];
  const subdomainsRandom = ['random'];
  const subdomainsMdot = ['m'];
  const subdomainsMdotCombined = ['www', 'm'];
  const locals = {};
  const req = { originalUrl, protocol, get };
  const res = { locals };
  const next = jest.fn();
  const middleware = setContext();
  return { subdomainsEmpty, subdomainsWww, subdomainsRandom, subdomainsMdot, subdomainsMdotCombined, req, res, next, middleware };
}

test('sets url and fullUrl', () => {
  const { subdomainsEmpty, req, res, next, middleware } = setup();
  const url = req.originalUrl
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  Object.assign(req, { subdomains: subdomainsEmpty });
  middleware(req, res, next);
  expect(res.locals.context).toEqual(expect.objectContaining({ url, fullUrl }))
});

test('properly sets desktop and mobile without subdomains', () => {
  const { subdomainsEmpty, req, res, next, middleware } = setup();
  const expectedContext = expect.objectContaining({ desktop: true, mobile: false });
  Object.assign(req, { subdomains: subdomainsEmpty });
  middleware(req, res, next);
  expect(res.locals.context).toEqual(expectedContext)
});

test('properly sets desktop and mobile with www subdomain', () => {
  const { subdomainsWww, req, res, next, middleware } = setup();
  const expectedContext = expect.objectContaining({ desktop: true, mobile: false });
  Object.assign(req, { subdomains: subdomainsWww });
  middleware(req, res, next);
  expect(res.locals.context).toEqual(expectedContext)
});

test('properly sets desktop and mobile with random subdomain', () => {
  const { subdomainsRandom, req, res, next, middleware } = setup();
  const expectedContext = expect.objectContaining({ desktop: true, mobile: false });
  Object.assign(req, { subdomains: subdomainsRandom });
  middleware(req, res, next);
  expect(res.locals.context).toEqual(expectedContext)
});

test('properly sets desktop and mobile with mdot subdomain', () => {
  const { subdomainsMdot, req, res, next, middleware } = setup();
  const expectedContext = expect.objectContaining({ desktop: false, mobile: true });
  Object.assign(req, { subdomains: subdomainsMdot });
  middleware(req, res, next);
  expect(res.locals.context).toEqual(expectedContext)
});

test('properly sets desktop and mobile with mdot and www subdomain', () => {
  const { subdomainsMdotCombined, req, res, next, middleware } = setup();
  const expectedContext = expect.objectContaining({ desktop: false, mobile: true });
  Object.assign(req, { subdomains: subdomainsMdotCombined });
  middleware(req, res, next);
  expect(res.locals.context).toEqual(expectedContext)
});
