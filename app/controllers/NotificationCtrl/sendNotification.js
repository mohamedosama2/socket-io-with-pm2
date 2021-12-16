const $baseCtrl = require('../$baseCtrl');
const notificationService = require('../../services/notification');
const { APIResponse } = require('../../utils');

module.exports = $baseCtrl(async (req, res) => {
  // only for development purpose
  if (process.env.NODE_ENV !== 'development') {
    return APIResponse.Forbidden(res);
  }

  const deviceToken = req.body.deviceToken;
  const message = {
    notification: {
      title: req.body.title,
      body: req.body.body
    }
  };

  await notificationService.sendNotification(deviceToken, message);
  return APIResponse.Ok(res, { message: 'successfully sent message' });
});
