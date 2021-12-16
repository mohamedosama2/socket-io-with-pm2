const $baseCtrl = require('../$baseCtrl');
const models = require('../../models');
const { APIResponse } = require('../../utils');

module.exports = $baseCtrl(async (req, res) => {
  const user = req.authenticatedUser;
  const count = await models.notification.count({
    receiver: user.id,
    read: false
  });

  const response = { count: count };
  return APIResponse.Ok(res, response);
});
