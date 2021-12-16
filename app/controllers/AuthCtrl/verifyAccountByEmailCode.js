const jwt = require("jsonwebtoken");
const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  // retreive specific user by email
  const user = await models._user.findOne({ email: req.body.email });
  if (!user) return APIResponse.NotFound(res, "User Not Found");
  // check if code which send to user is equal to code which entered by him
  if (parseInt(user.code) === parseInt(req.body.code)) {
    user.enabled = true;
    user.code = undefined;
    await user.save();
    const payload = {
      userId: user.id,
      userRole: user.role,
    };
    const options = {};
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    let response = {
      token,
      user,
    };

    return APIResponse.Ok(res, response);
  }
  // If code is not correct
  return APIResponse.Unauthorized(res, "Verification code is incorrect .");
});
