const sendHtml = require('../../lib/middlewares/sendHtml');

function setup() {
  const body = '<div>test</div>'
  const locals = { body };
  const end = jest.fn();
  const req = {};
  const res = { locals, end };
  const next = jest.fn();
  const middleware = sendHtml();
  return { body, locals, req, res, next, end, middleware };
};

test('ends the respons with the body', () => {
  const { body, req, res, next, middleware } = setup();
  middleware(req, res, next);
  expect(res.end).toHaveBeenCalledWith(body);
});

test('calls next', () => {
  const { req, res, next, middleware } = setup();
  middleware(req, res, next);
  expect(next).toHaveBeenCalledWith();
});
