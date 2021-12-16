const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

module.exports = {
  connect: (cb) => {
    return mongoose
      .connect(process.env.MONGODB_URI2, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(function () {
        cb();
      })
      .catch(function (err) {
        console.error(err.message.red);
        process.exit(1);
      });
  },
};
