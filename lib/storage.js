const fs = require('fs');
const os = require('os');
const path = require('path');
const arrayLast = require('array-last');

class DiskStorage {
  constructor(fileName, destination = os.tmpdir()) {
    this.getfileName = fileName;
    this.destination = destination;
    this.makeDir();
  }

  makeDir() {
    if (!fs.existsSync(this.destination)) {
      fs.mkdirSync(this.destination);
    }
  }

  async handleFile(filename, fileb64) {
    const fileName = await this.getfileName(filename);
    if (!fileName) {
      throw new Error('fileName generation failed!');
    }

    const filePath = path.join(this.destination, fileName);
    await fs.promises.writeFile(filePath, fileb64, { encoding: 'base64' });

    return {
      path: filePath,
      filename: fileName,
      destination: this.destination,
      ext: path.extname(fileName),
    };
  }
}

module.exports = DiskStorage;
