var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Laundry');
// mongodb://ajitpawar005:24klen005@ds145178.mlab.com:45178/24klen
// mongodb://localhost:27017/Laundry
// mongodb://24klen:24klen@139.59.59.149:27017/24klen

module.exports = {mongoose};