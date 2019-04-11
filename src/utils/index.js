function isUrl(string) {
  try {
    return Boolean(new URL(string));
  } catch (err) {
    return false;
  }
}

module.exports.isUrl = isUrl;
