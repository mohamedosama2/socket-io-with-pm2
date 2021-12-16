const includeAll = require('include-all');

module.exports =
  includeAll({
    dirname: __dirname,
    filter: /^(?!index|setup)(.+)\.js$/,
  }) || {};
