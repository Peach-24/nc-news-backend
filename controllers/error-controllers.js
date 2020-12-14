exports.send404 = (req, res, next) => {
  res.status(404).send({ msg: 'Not found' });
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ msg: 'Invalid method' });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  // console.log("PSQL ERROR CODE:", err.code);
  // console.log(err.toString())
  const errorCodes = ['42703', '22P02'];
  if (errorCodes.includes(err.code)) {
    res.status(400).send({ msg: 'Bad request' });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleInternalErrors = (err, req, res, next) => {
  // console.log("INTERNAL ERROR >>>>>>>>", err.toString());
  res.status(500).send({ msg: 'Internal Server Error:', MORE: err.toString() });
};
