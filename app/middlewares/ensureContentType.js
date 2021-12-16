const { APIResponse } = require('../utils');

// Ensure content-type of the request
// ['application/json', 'multipart/form-data]
module.exports = (req, res, next) => {
  let contentType = req.headers['content-type'];
  if (
    contentType &&
    !(
      contentType.includes('application/json') ||
      contentType.includes('multipart/form-data')
    )
  ) {
    return APIResponse.UnsupportedMediaType(res);
  }
  return next();
};
