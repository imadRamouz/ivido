if (process.env.NODE_ENV === 'production') {
  module.exports.mongoURI = "mongodb://imadramouz:qsd123789@ds243084.mlab.com:43084/ivido-db";
} else {
  module.exports.mongoURI = "mongodb://localhost/ivido-dev";
}