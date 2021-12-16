const mongoose = require("mongoose");

const $baseModel = require("../$baseModel");

const schema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    rightAnswers: [
      {
        type: String,
        required: true,
      },
    ],
    wrongAnswers: [
      {
        type: String,
        required: true,
      },
    ],
    degree: { type: Number, required: true },
  },
  { timestamps: true }
);

const response = (doc) => {
  return {
    id: doc.id,
    question: doc.question,
    rightAnswers: doc.rightAnswers,
    wrongAnswers: doc.wrongAnswers,
    degree: doc.degree,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = $baseModel("questions", schema, {
  responseFunc: response,
  // here you can add any option with in baseSchema
});
