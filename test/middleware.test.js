const middleware = require("../lib/middleware");
const logger = require("../lib/logger");

jest.mock("../lib/logger");

const protocol = "http";
const get = jest.fn(key => key);
const originalUrl = "/article/1";
const url = originalUrl;
const subdomains = [];
const fullUrl = `${protocol}://host${originalUrl}`;
const req = { protocol, get, originalUrl, subdomains };
const res = { end: jest.fn(), sendStatus: jest.fn() };
const next = jest.fn();
const html = "<p>Some test html</p>";
const render = jest.fn(async () => html);
const m = middleware(render);

beforeEach(() => {
  jest.clearAllMocks();
});

test("ends the response with the rendered html", async () => {
  await m(req, res, next);
  expect(res.end).toHaveBeenCalledWith(html);
});

test("handles errors by default with the default statusCode", async () => {
  const error = new Error("Test error message");
  render.mockImplementationOnce(() => {
    throw error;
  });
  await m(req, res, next);
  expect(res.sendStatus).toHaveBeenCalledWith(500);
  expect(logger.error).toHaveBeenCalledWith(error);
});

test("handles erros by default with a provided statusCode", async () => {
  const error = { statusCode: 404 };
  render.mockImplementationOnce(() => {
    throw error;
  });
  await m(req, res, next);
  expect(res.sendStatus).toHaveBeenCalledWith(error.statusCode);
  expect(logger.error).toHaveBeenCalledWith(error);
});

test("uses a custom eror handler", async () => {
  const errorHandler = jest.fn();
  const mWithCustomErrorHandler = middleware(render, errorHandler);
  const error = new Error("Test error message");
  render.mockImplementationOnce(() => {
    throw error;
  });
  await mWithCustomErrorHandler(req, res, next);
  expect(errorHandler).toHaveBeenCalledWith(error, req, res, next);
});

test("passes the url to the app as context", async () => {
  await m(req, res, next);
  expect(render).toHaveBeenCalledWith(expect.objectContaining({ url }));
});

test("passes the fullUrl to the app as context", async () => {
  await m(req, res, next);
  expect(render).toHaveBeenCalledWith(expect.objectContaining({ fullUrl }));
});

test("passes mobile and desktop to the app as context when the subdomain 'm' is given", async () => {
  const reqMobile = Object.assign({}, req, { subdomains: ["foo", "m", "bar"] });
  await m(reqMobile, res, next);
  expect(render).toHaveBeenCalledWith(expect.objectContaining({ mobile: true, desktop: false }));
});

test("passes mobile and desktop to the app as context when the subdomain 'm' is not given", async () => {
  const reqNonMobile = Object.assign({}, req, { subdomains: [] });
  await m(reqNonMobile, res, next);
  expect(render).toHaveBeenCalledWith(expect.objectContaining({ mobile: false, desktop: true }));
});

test("passes mobile and desktop to the app as context when the subdomain 'www' is given", async () => {
  const reqNonMobile = Object.assign({}, req, { subdomains: ["www"] });
  await m(reqNonMobile, res, next);
  expect(render).toHaveBeenCalledWith(expect.objectContaining({ mobile: false, desktop: true }));
});
