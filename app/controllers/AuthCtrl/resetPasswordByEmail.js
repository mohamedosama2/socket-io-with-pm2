const jwt = require("jsonwebtoken");
const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const bcrypt = require("bcryptjs");

// [TODO] refactor this with html page
module.exports = $baseCtrl(async (req, res) => {
  if (!req.body.password)
    return APIResponse.BadRequest(res, "Password is required");

  let user = await models._user.findOne({ email: req.body.email });
  if (!user) return APIResponse.NotFound(res);

  if (parseInt(user.code) !== parseInt(req.body.code)) {
    return APIResponse.Unauthorized(res, "verification code is not correct");
  }

  // Encrypt Password
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);
  user.password = hash;
  user.code = undefined;
  await user.save();

  let payload = { userId: user.id, userRole: user.role };
  let options = {};
  let token = jwt.sign(payload, process.env.JWT_SECRET, options);

  const response = {
    token: token,
    user,
  };

  return APIResponse.Ok(res, response);
});
