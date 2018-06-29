var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Laundry', { useMongoClient: true });
// mongodb://ajitpawar005:24klen005@ds145178.mlab.com:45178/24klen
// mongodb://localhost:27017/Laundry
module.exports = {mongoose};
