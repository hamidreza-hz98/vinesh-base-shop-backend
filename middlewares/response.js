module.exports = (req, res, next) => {
  res.success = ({code=200 , message = "", data =""}) => {
    res.status(code).json({ message, data });
  };

  res.error = ({code=500 , message = ""}) => {
    res.status(code).json({ message, code });
  };

  next();
};
