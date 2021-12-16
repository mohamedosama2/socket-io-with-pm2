const { APIResponse } = require("../utils");

module.exports = (req, res, next) => {
  if (!req.authenticatedUser) {
    return APIResponse.Unauthorized(res);
  }
  return next();
};
