function isProd() {
  return process.env.NODE_ENV === 'production';
}

module.exports = {
  isProd,
};
