const _ = require('lodash');
const $baseCtrl = require('../$baseCtrl');
const { APIResponse } = require('../../utils');

module.exports = $baseCtrl(async (req, res) => {
  const user = req.authenticatedUser;

  const token = req.body.token;
  if (token) {
    const index = _.findKey(
      user.pushTokens,
      _.matchesProperty('deviceToken', token)
    );
    if (index !== undefined) {
      user.pushTokens.splice(index, 1);
      await user.save();
    }
  }

  return APIResponse.NoContent(res);
});
