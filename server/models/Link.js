const mongoose = require('mongoose');
const shortid = require('shortid');

const linkSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Простая проверка URL
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: 'Некорректный URL'
    }
  },
  shortCode: {
    type: String,
    default: shortid.generate,
    unique: true
  },
  customCode: {
    type: String,
    unique: true,
    sparse: true
  },
  ctaData: {
    text: String,
    buttonText: String,
    buttonColor: String,
    backgroundColor: String,
    position: String,
    imageUrl: String,
    fontSize: Number,
    borderRadius: Number,
    shadowSize: Number
  },
  masking: {
    enabled: Boolean,
    customDomain: String,
    customPath: String
  },
  clicks: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  userId: String
});

module.exports = mongoose.model('Link', linkSchema);
