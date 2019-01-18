class BuildIdWebpackPlugin {
  constructor({ uid, prefix } = {}) {
    this.uid = uid ? uid : this.generateUid();
    this.prefix = prefix;
    this.compilations = [];
  }

  generateUid() {
    const randString = Math.random().toString(36);
    const uid = randString.substr(2, 9);
    return uid;
  }

  replaceBuildId(path, data) {
    path = typeof path === 'function' ? path(data) : path;
    const replacement = this.prefix ? `${this.prefix}${this.uid}` : this.uid;
    return path.replace(/\[buildId\]/gi, replacement);
  }

  apply(compiler) {
    /* 
    compiler.plugin('compilation', compilation => {
      
      compilation.mainTemplate.plugin('asset-path', (path, data) =>
        this.replaceBuildId(path, data)
      );
    }); */

    this.compiler = compiler;

    compiler.hooks.compilation.tap('BuildIdWebpackPlugin', compilation => {
      const mainTemplate = compilation.mainTemplate;
      this.compilations.push(compilation);

      mainTemplate.hooks.assetPath.tap('TemplatedPathPlugin', (path, data) => {
        debugger;
      });

      mainTemplate.hooks.globalHashPaths.tap('BuildIdWebpackPlugin', paths => {
        debugger;
      });

      mainTemplate.hooks.globalHash.tap('BuildIdWebpackPlugin', (chunk, paths) => {
        debugger;
      });
    });
  }
}

module.exports = BuildIdWebpackPlugin;
