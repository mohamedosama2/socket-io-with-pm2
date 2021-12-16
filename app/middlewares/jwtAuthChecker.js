const jwt = require("jsonwebtoken");
const { APIResponse } = require("../utils");
const models = require("../models");

// jwt Auth Checker
module.exports = (req, res, next) => {
  req.authenticatedUser = null;
  if (!req.headers["authorization"]) {
    return next();
  }
  const token = req.headers["authorization"].split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name) {
        if (err.name === "JsonWebTokenError") {
          console.log("here");
          return APIResponse.Unauthorized(res, "Invalid access token.");
        } else if (err.name === "TokenExpiredError") {
          return APIResponse.Unauthorized(
            res,
            "Expired access token, please login again."
          );
        }
      }
      return APIResponse.ServerError(res, err, err.message);
    }

    if (decoded.userId === undefined) {
      return APIResponse.Unauthorized(res, "Invalid access token.");
    }

    let user = await models._user.findById(decoded.userId);

    if (user && !user.enabled) {
      return APIResponse.Unauthorized(res, "Your account is disabled");
    }

    req.authenticatedUser = user;
    req.me = user;
    return next();
  });
};
