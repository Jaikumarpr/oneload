/* eslint-disable consistent-return */
/**
 * Oneload
 * middleware to parse base64 encoded files from a json body
 * expects attribute with datauri format
 * follows quasi multer architecture
 */

// opts
// fileName
// destination folder
// filetypes
// limits
const fs = require('fs');
const isType = require('type-is');

const { parseKeyData } = require('./utils');

// eslint-disable-next-line no-unused-vars
const fileFilter = async (mime) => true;

class Oneload {
  constructor(storage, filefilter = fileFilter, limits) {
    this.storage = storage;
    this.fileFilter = filefilter;
    this.limits = limits;
  }
  //   function with middleware

  withFile(key) {
    // let that = this;
    return async (req, res, next) => {
      try {
        if (!isType(req, ['application/json'])) {
          return next();
        }
        const { mime, fileName, base64: fileb64 } = parseKeyData(req.body[key]);

        const isAllowed = await this.fileFilter(mime);

        if (!isAllowed) {
          throw new Error('mime type is not allowed');
        }

        // TODO check if file size is with in limits

        const { path, size, filename, destination, ext } =
          await this.storage.handleFile(fileName, fileb64);

        req.file = { path, size, filename, destination, ext };

        // remove req body key
        delete req.body[key];
        return next();
      } catch (error) {
        next(error);
      }
    };
  }
}

module.exports = Oneload;
