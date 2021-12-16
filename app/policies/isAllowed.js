const { APIResponse } = require('../utils');

module.exports = allowed => {
  return (req, res, next) => {
    let role = req.authenticatedUser.role;
    let pass = false;
    if (allowed.constructor === Array) {
      for (let i = 0; i < allowed.length; i++) {
        if (role === allowed[i]) {
          pass = true;
          break;
        }
      }
    } else if (allowed.constructor === String) {
      pass = role === allowed;
    }

    if (!pass) {
      return APIResponse.Forbidden(res, { msg: `You dont have premission to access this => ${req.authenticatedUser.role}` });
    }

    return next();
  };
};
