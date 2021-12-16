const _ = require('lodash');
const $baseCtrl = require('../$baseCtrl');
const models = require('../../models');
const { APIResponse } = require('../../utils');

module.exports = $baseCtrl(async (req, res) => {

  const user = req.authenticatedUser;
  const notifications = await models.notification.fetchAll(
    req.allowPagination,
    { ...req.queryFilter, receiver: user.id },
    { ...req.queryOptions, sort: '-createdAt' }
  );

  const collection = req.allowPagination ? notifications.docs : notifications;
  for (let i = 0; i < collection.length; i++) {
    let notification = _.cloneDeep(collection[i]); // here copy values not referece
    // let notification = collection[i] // copy reference
    if (notification.read) continue
    notification.read = true;
    await notification.save();
  }

  return APIResponse.Ok(res, notifications);
});
