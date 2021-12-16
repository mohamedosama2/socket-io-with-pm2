// Server error handler
// [TODO]: enhance to support 500 in different way
module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let status = err.status ? +err.status : 500;
  let message = '';
  if (status >= 500) {
    message = 'Internal Server Error';
  } else {
    message = err.message ? err.message : 'Something went wrong.';
  }

  console.error(err);
  console.error(err.message.red);
  return res.status(status).json({ message: message });
};
