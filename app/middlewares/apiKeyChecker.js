const { APIResponse } = require('../utils');

const apiKeys = {
  admin: process.env.ADMIN_API_KEY,
  teacher: process.env.TEACHER_API_KEY,
  student: process.env.STUDENT_API_KEY,
  parent: process.env.PARENT_API_KEY
};

module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === apiKeys.admin) req.apiKeyRole = 'admin';
  else if (apiKey === apiKeys.teacher) req.apiKeyRole = 'teacher';
  else if (apiKey === apiKeys.student) req.apiKeyRole = 'student';
  else if (apiKey === apiKeys.parent) req.apiKeyRole = 'parent';
  else {
    req.apiKeyRole = null;
    if (process.env.NODE_ENV === 'development') return next();
    return APIResponse.Unauthorized(res, 'API Key is missed');
  }

  return next();
};
