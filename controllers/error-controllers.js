exports.send404 = (req, res, next) => {
  res.status(404).send({ msg: "Not found" }).next();
};

exports.handlePSQLErrors = (err, req, res, next) => {
  console.log("PSQL ERROR:", err.toString(), err.code);
  const errorCodes = ["42703"];
  if (errorCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  }
};

exports.handleInternalErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" }).next(err);
};
