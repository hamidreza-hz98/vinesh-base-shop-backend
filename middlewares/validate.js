module.exports = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((err) => err.message);
      return res.status(400).json({
        message: 'Validation error',
        data: messages,
      });
    }

    req.body = value;
    next();
  };
};
