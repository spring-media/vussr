function listenAsPromised(server, port, host) {
  return new Promise((resolve, reject) => {
    const listener = server.listen(port, host, err => (err ? reject(err) : resolve(listener)));
  });
}

function closeAsPromised(listener) {
  return new Promise((resolve, reject) => {
    if (!listener) return resolve();
    listener.close(err => (err ? reject(err) : resolve()));
  });
}

module.exports.listenAsPromised = listenAsPromised;
module.exports.closeAsPromised = closeAsPromised;
