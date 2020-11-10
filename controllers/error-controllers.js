exports.send404 = (req, res, next) => {
  res.status(404).send({ msg: "Not found" }).catch(next);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  console.log(err);
};

exports.handleInternalErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
