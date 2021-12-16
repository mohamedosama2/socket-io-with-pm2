const jwt = require("jsonwebtoken");
const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const smsService = require("../../services/sms");
const bcrypt = require("bcryptjs");

// [TODO] refactor this with html page
module.exports = $baseCtrl(async (req, res) => {
  const forgetCode = req.body.code;
  const phone = req.body.phone;

  if (!req.body.password)
    return APIResponse.BadRequest(res, "Password is required");

  var verificationResult = await smsService.verificationCode(phone, forgetCode);
  if (verificationResult.status !== "approved")
    return APIResponse.BadRequest(res, "Code is invailed");

  let user = await models._user.findOne({ phone });
  // Encrypt Password
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);
  req.body.password = hash;

  await user.set({ password: req.body.password }).save();

  const payload = { userId: user.id, userRole: user.role };
  const options = {};
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  const response = {
    token: token,
    user: user,
  };

  return APIResponse.Ok(res, response);
});
