const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');
const APIResponse = require('../utils/APIResponse');

module.exports = options => {
  options = options || {};
  let dest = options.dest || './uploads';
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      crypto.pseudoRandomBytes(16, (err, raw) => {
        if (err) {
          return APIResponse.ServerError(res, err);
        }
        let fileName =
          raw.toString('hex') +
          Date.now() +
          '.' +
          mime.getExtension(file.mimetype);
        cb(null, fileName);
      });
    }
  });
};
