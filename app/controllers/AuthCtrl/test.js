const $baseCtrl = require("../$baseCtrl");
const { APIResponse } = require("../../utils");
const smsService = require("../../services/sms");

module.exports = $baseCtrl(async (req, res) => {
  // try {
  //     let p = await smsService.sendVerificationCode('+201092740203');
  //     console.log(p)
  // } catch (error) {
  //     console.log(error);
  //     return APIResponse.ServerError(res, error);
  // }

  // return APIResponse.Ok(res, { message: 'Message sent successfully' });

  return APIResponse.Ok(res, { message: "running" });
});
