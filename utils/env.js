function isProd() {
  process.env.NODE_ENV === 'production';
}

module.exports = {
  isProd,
};
