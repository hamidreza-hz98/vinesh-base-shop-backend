module.exports = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;

  throw err;
};
