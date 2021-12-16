const mongoose = require('mongoose');
const $baseModel = require('../$baseModel');

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default:
        'https://res.cloudinary.com/derossy-backup/image/upload/v1555206853/deross-samples/notifications/bell.png'
    },
    initiator: {
      type: Number,
      ref: 'user'
    },
    receiver: {
      type: Number,
      ref: 'user'
    },
    read: {
      type: Boolean,
      default: false
    },
    subjectType: {
      type: String,
      enum: ["post", "comment", "solution", "materila", "lesson", "exam", "session", "admin"]
    },
    subject: {
      type: Number,
      refPath: "subjectType"
    }
  },
  { timestamps: true }
);

schema.methods.toFirebaseNotification = function () {
  return {
    notification: {
      title: this.title,
      body: this.body
    }
  };
};

const response = doc => {
  return {
    id: doc.id,
    // type: doc.type,
    title: doc.title,
    body: doc.body,
    icon: doc.icon,
    read: doc.read,
    initiator: doc.initiator,
    receiver: doc.receiver,
    subjectType: doc.subjectType,
    subject: doc.subject,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
};

module.exports = $baseModel('notification', schema, {
  responseFunc: response
});
