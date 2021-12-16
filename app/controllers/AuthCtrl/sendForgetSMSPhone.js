const $baseCtrl = require("../$baseCtrl");
const { APIResponse } = require("../../utils");
const smsService = require("../../services/sms");
const models = require("../../models");

module.exports = $baseCtrl(async (req, res) => {
  if (!req.body.phone) return APIResponse.BadRequest(res, "Phone is required");

  if (!req.body.phone.match(/^\+201[0125][0-9]{8}$/))
    return APIResponse.BadRequest(res, "Phone is invailed");

  const user = await models._user.findOne({ phone: req.body.phone });
  if (!user) return APIResponse.NotFound(res, "Phone not found");

  try {
    await smsService.sendVerificationCode(req.body.phone);
  } catch (error) {
    console.log(error);
    return APIResponse.ServerError(500, error);
  }

  return APIResponse.Ok(res, { message: "Message sent successfully" });
});
