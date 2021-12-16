const express = require("express");
const policies = require("../policies");
const ctrls = require("../controllers");
const resources = require("./resources");
const passport = require("passport");
// const amqp = require("amqplib");

// require("../services/passport");

let apiRouter = express.Router();

// public
// apiRouter.post("/processData", ctrls.AuthCtrl.testRabbitMq);

apiRouter.post("/verify-reset", ctrls.AuthCtrl.resetPasswordByPhone);
apiRouter.get("/test", ctrls.AuthCtrl.test);
apiRouter.post("/forget", ctrls.AuthCtrl.sendForgetSMSPhone);
apiRouter.post("/signup-phone", ctrls.AuthCtrl.signupPhone);
apiRouter.post("/verify", ctrls.AuthCtrl.verifyAccountByPhoneCode);
apiRouter.post("/login-phone", ctrls.AuthCtrl.loginPhone);
apiRouter.post("/signup", ctrls.AuthCtrl.signupEmail);
apiRouter.post("/resend", ctrls.AuthCtrl.SendForgetCodeEmail);
apiRouter.post("/reset-password", ctrls.AuthCtrl.resetPasswordByEmail);
apiRouter.post(
  "/login-google",
  passport.authenticate("googleToken1", { session: false }),
  ctrls.AuthCtrl.loginGoogle
);
apiRouter.post("/login-facebook", ctrls.AuthCtrl.loginFacebook);

apiRouter.post("/test", ctrls.AuthCtrl.test);
// private
apiRouter.use(policies.isAuthenticated);

// populate all resources
for (let key of Object.keys(resources)) {
  let resource = resources[key];
  apiRouter.use(resource);
}

module.exports = apiRouter;
