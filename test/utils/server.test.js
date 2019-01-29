const { listenAsPromised, closeAsPromised } = require('../../src/utils/server');

function setup() {
  const port = 'port';
  const host = 'host';
  const close = jest.fn().mockImplementation(cb => cb(null));
  const listener = { close };
  const listen = jest.fn().mockImplementation((port, host, cb) => {
    setTimeout(() => cb(null), 0);
    return listener;
  });
  const server = { listen };
  return { listen, close, server, listener, port, host };
}

test('listenAsPromised resolves the listener', async () => {
  const { server, listener, port, host } = setup();
  const returnedListener = await listenAsPromised(server, port, host);
  expect(returnedListener).toBe(listener);
  expect(server.listen).toHaveBeenCalledWith(port, host, expect.any(Function));
});

test('listenAsPromised rejects with an error', async () => {
  const { server, port, host } = setup();
  const error = new Error('Expected error');
  server.listen = jest.fn().mockImplementation((port, host, cb) => cb(error));
  expect(listenAsPromised(server, port, host)).rejects.toThrowErrorMatchingSnapshot();
  expect(server.listen).toHaveBeenCalledWith(port, host, expect.any(Function));
});

test('closeAsPromised waits for the server to be closed', async () => {
  const { close, listener } = setup();
  await closeAsPromised(listener);
  expect(close).toHaveBeenCalled();
});

test('closeAsPromised resolves if the provided listener is falsy', async () => {
  expect(closeAsPromised(undefined)).resolves.toBe(undefined);
});

test('closeAsPromised rejects with an error', async () => {
  const { listener } = setup();
  const error = new Error('Expected error');
  listener.close = jest.fn().mockImplementation(cb => cb(error));
  expect(closeAsPromised(listener)).rejects.toThrowErrorMatchingSnapshot();
  expect(listener.close).toHaveBeenCalled();
});
