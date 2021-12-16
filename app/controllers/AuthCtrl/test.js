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
  var verificationResult = await smsService.verificationCode(
    "+201092740203",
    "131024"
  );
  if (verificationResult.status !== "approved")
    return APIResponse.BadRequest(res, "Code is invailed");
  return APIResponse.Ok(res, { message: "Phone verified" });
});
