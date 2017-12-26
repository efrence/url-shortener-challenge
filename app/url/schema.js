const mongo = require('../../server/mongodb');
const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')({ hidden: { _id: true } })

let UrlSchema =  new mongoose.Schema({
  url: {
    type: String,
    required: true
  },

  user: mongoose.Schema.Types.ObjectId,

  hash: {
    type: String,
    required: true,
    unique: true
  },

  isCustom: {
    type: Boolean,
    required: true
  },

  visits: Number,

  removeToken: {
    type: String,
    required: true
  },

  protocol: {type: String, hide: true},
  domain: {type: String, hide: true},
  path: {type: String, hide: true},

  createdAt: {
    type: Date,
    default: Date.now
  },
  removedAt: Date,

  active: {
    type: Boolean,
    required: true,
    default: true
  }
});


UrlSchema.plugin(mongooseHidden)

module.exports = mongo.model('Url', UrlSchema);
