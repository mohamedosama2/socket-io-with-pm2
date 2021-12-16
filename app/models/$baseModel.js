const mongoose = require('mongoose');
const $baseSchema = require('./$baseSchema');

module.exports = (modelName, schema, options = {}) => {
  return mongoose.model(modelName, $baseSchema(modelName, schema, options));
};
