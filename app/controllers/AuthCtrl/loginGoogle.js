const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const $baseCtrl = require('../$baseCtrl');
const models = require('../../models');
const { APIResponse } = require('../../utils');

module.exports = $baseCtrl(async (req, res) => {
  // if (!req.body.idToken)
  //   return APIResponse.BadRequest(res, 'idToken is required');

  // let googlePayload;
  // try {
  //   const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  //   const ticket = await client.verifyIdToken({
  //     idToken: req.body.idToken
  //   });
  //   googlePayload = ticket.getPayload();
  //   if (!googlePayload.email) throw new Error('No email provided');
  // } catch (err) {
  //   return APIResponse.BadRequest(res, 'Invalid idToken');
  // }

  // let user = await models._user.findOne({ email: googlePayload.email });
  // if (!user) {
  //   user = await new models._user({
  //     username: googlePayload.name,
  //     email: googlePayload.email,
  //     photo: googlePayload.picture,
  //     enabled: true,
  //     role: "student"
  //   }).save();
  // }


  // let payload = { userId: user.id, userRole: user.role };
  // let options = {};
  // let token = jwt.sign(payload, process.env.JWT_SECRET, options);

  // const response = {
  //   token: token,
  //   user: user,
  // };


  // return APIResponse.Ok(res, response);
  const userResponce = await models._user
    .findById(req.authenticatedUser.id)
    .populate({ path: 'class', populate: { path: 'level', populate: { path: 'system' } } })
  console.log(req.authenticatedUser)
  const token = jwt.sign({ userId: req.authenticatedUser.id }, process.env.JWT_SECRET)
  res.status(200).json({ token, msg: "User Logged In With google !", user: userResponce })
});
