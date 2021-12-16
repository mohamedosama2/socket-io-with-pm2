const $baseCtrl = require("../$baseCtrl");
const { APIResponse } = require("../../utils");

// [TODO] refactor this with html page
module.exports = $baseCtrl(async (req, res) => {
  return APIResponse.Ok(res, req.me);
});
