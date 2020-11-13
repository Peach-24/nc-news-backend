exports.send404 = (req, res, next) => {
  res.status(404).send({ msg: "Not found" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  console.log("PSQL ERROR:", err.toString(), err.code);
  const errorCodes = ["42703", "22P02"];
  if (errorCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
};

exports.handleInternalErrors = (err, req, res, next) => {
  console.log("INTERNAL ERROR >>>>>>>>", err.toString());
  res.status(500).send({ msg: "Internal Server Error" });
};
