const _ = require('lodash');
const $baseCtrl = require('../$baseCtrl');
const { APIResponse } = require('../../utils');

module.exports = $baseCtrl(async (req, res) => {
  const user = req.authenticatedUser;

  const oldToken = req.body.oldToken;
  if (oldToken) {
    const index = _.findKey(
      user.pushTokens,
      _.matchesProperty('deviceToken', oldToken)
    );
    if (index !== undefined) {
      user.pushTokens.splice(index, 1);
    }
  }

  const token = req.body.token;
  if (token) {
    const index = _.findKey(
      user.pushTokens,
      _.matchesProperty('deviceToken', token)
    );
    if (index === undefined) {
      user.pushTokens.push({
        deviceType: req.body.deviceType,
        deviceToken: token
      });
    }
  }

  await user.save();
  console.log(user.pushTokens)
  return APIResponse.NoContent(res);
});
