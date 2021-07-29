'use strict';

const { path, fsp, vm } = require('./dependencies').node;

class Config {
  constructor(configPath) {
    this.sections = {};
    this.path = configPath;
    this.sandbox = vm.createContext({});

    return this.loadFilesToSections();
  }

  async loadFilesToSections() {
    const files = await fsp.readdir(this.path);

    for (const fileName of files) {
      await this.executeAndLoadFile(fileName);
    }

    return this.sections;
  }

  async executeAndLoadFile(fileName) {
    const filePath = path.join(this.path, fileName);

    const { name: fileNameWithoutExt, ext } = path.parse(filePath);

    if (ext !== '.js') {
      return;
    }

    const fileSrc = await fsp.readFile(filePath, 'utf8');
    const fileScript = new vm.Script(fileSrc);
    const executionResult = fileScript.runInContext(this.sandbox);

    this.sections[fileNameWithoutExt] = executionResult;
  }
}

module.exports = Config;
