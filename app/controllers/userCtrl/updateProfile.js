const jwt = require("jsonwebtoken");
const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const cloudinaryStorage = require("../../services/cloudinaryStorage");

module.exports = $baseCtrl(
  [{ name: "photo", maxCount: 1 }],
  cloudinaryStorage,
  async (req, res) => {
    const authUser = req.authenticatedUser;
    const user = await models._user.findById(authUser.id);

    // if (req.body.country) {
    //   let countries = ["Egypt", "SaudiArabia"];
    //   let key = countries.indexOf(req.body.country);
    //   if (key === -1) {
    //     return APIResponse.UnprocessableEntity(
    //       res,
    //       "invalid value for country."
    //     );
    //   }
    // }

    // Check if phone Already Exist
    if (req.body.phone) {
      const existingPhone = await models._user.findOne({
        phone: req.body.phone,
        _id: { $ne: req.authenticatedUser.id },
      });
      if (existingPhone) {
        return APIResponse.BadRequest(res, " phone Already in use .");
      }
    }

    // Upload photo if enter by user
    if (req.files && req.files["photo"]) {
      req.body.photo = req.files["photo"][0].secure_url;
    } else {
      delete req.body.photo;
    }

    delete req.body.password;
    delete req.body.email;
    delete req.body.role;
    delete req.body.code;
    delete req.body.pushTokens;
    delete req.body.enabled;
    
    // save user to db
    await user.set(req.body).save();

//     let payload = { userId: user.id, userRole: user.role };
//     let options = {};
//     let token = jwt.sign(payload, process.env.JWT_SECRET, options);

    const response = {
//       token: token,
      user,
    };

    return APIResponse.Created(res, response);
  }
);
