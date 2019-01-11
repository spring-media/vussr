function listenAsPromised(server, port, host) {
  return new Promise((res, rej) => {
    const listener = server.listen(port, host, err => err ? rej(err) : res(listener));
  });
}

function closeAsPromised(listener) {
  return new Promise((res, rej) => {
    if (!listener) return res();
    listener.close(err => err ? rej(err) : res())
  })
}

module.exports.listenAsPromised = listenAsPromised;
module.exports.closeAsPromised = closeAsPromised;
