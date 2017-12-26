const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use JavaScript promises
const { Mongo } = require('../environment');
let dbName = process.env.TEST === 'true' ? Mongo.NAME_TEST : Mongo.NAME;
const uri = `mongodb://${Mongo.HOST}:${Mongo.PORT}/${dbName}`;

/**
 , {
  auth: { authSource: Mongo.AUTH },
  user: Mongo.USER,
  pass: Mongo.PASS
}
 */
const db = mongoose.createConnection(uri);

module.exports = db;
