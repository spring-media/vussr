const runApp = require('../../src/middlewares/runApp');

function setup() {
  const greeting = 'hello world';
  const context = { greeting };
  const renderFn = async context => `<div>${context.greeting}</div>`;
  const renderFnMock = jest.fn().mockImplementation(renderFn);
  const middleware = runApp(renderFnMock);
  const locals = { context };
  const req = {};
  const res = { locals };
  const next = jest.fn();
  return { greeting, context, renderFn, renderFnMock, middleware, locals, req, res, next };
}

test('sets the body variable on the locals', async () => {
  const { context, renderFn, middleware, req, res, next } = setup();
  const expectedBody = await renderFn(context);
  await middleware(req, res, next);
  expect(res.locals.body).toBe(expectedBody);
});

test('calls next', async () => {
  const { middleware, req, res, next } = setup();
  await middleware(req, res, next);
  expect(next).toHaveBeenCalledWith();
});

test('calls next with an error', async () => {
  const { req, res, next } = setup();
  const error = new Error();
  const throwError = () => {
    throw error;
  };
  const brokenMiddleware = runApp(throwError);
  await brokenMiddleware(req, res, next);
  expect(next).toHaveBeenCalledWith(error);
});
