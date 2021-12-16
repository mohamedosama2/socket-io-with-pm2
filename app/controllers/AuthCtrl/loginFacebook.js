const graph = require('fbgraph');
const jwt = require('jsonwebtoken');
const $baseCtrl = require('../$baseCtrl');
const models = require('../../models');
const { APIResponse } = require('../../utils');

module.exports = $baseCtrl(async (req, res) => {
  if (!req.body.accessToken)
    return APIResponse.BadRequest(res, 'accessToken is required');

  let facebookPayload;
  try {
    graph.setAccessToken(req.body.accessToken);
    facebookPayload = await new Promise((resolve, reject) => {
      return graph.get('me?fields=id,name,email,gender,picture{url}', (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
    if (!facebookPayload.email) throw new Error('No email provided');
  } catch (err) {
    console.log(err);
    return APIResponse.BadRequest(res, 'Invalid idToken');
  }
  console.log(facebookPayload.picture.data.url)
  let user = await models._user.findOne({ email: facebookPayload.email });
  if (!user) {
    user = await new models._user({
      username: facebookPayload.name,
      email: facebookPayload.email,
      // gender: facebookPayload.gender,
      enabled: true,
      // photo: facebookPayload.picture.data.url,
      role: "student"
    }).save();
  }


  let payload = { userId: user.id, userRole: user.role };
  let options = {};
  let token = jwt.sign(payload, process.env.JWT_SECRET, options);

  const userResponce = await models._user
    .populate(user, { path: 'class', populate: { path: 'level', populate: { path: 'system' } } })

  const response = {
    token: token,
    user: userResponce,
  };

  return APIResponse.Ok(res, response);
});
/*
{ id: '2749750138579842',
  name: 'Kareem Arafa',
  email: 'kareem.arafa1515@gmail.com',
  picture:
   { data:
      { url: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2749750138579842&height=50&width=50&ext=1599865364&hash=AeQcQSJ0OuQ_wVwa' } } }
*/