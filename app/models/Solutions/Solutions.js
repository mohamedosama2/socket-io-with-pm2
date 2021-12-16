const mongoose = require("mongoose");

const $baseModel = require("../$baseModel");

const schema = new mongoose.Schema(
  {
    exam: {
      type: Number,
      required: true,
      ref: "exams",
    },
    student: {
      type: Number,
      required: true,
      ref: "users",
    },
    solutions: [solutionsSchema()],
    studentMark: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
function solutionsSchema() {
  const schema = mongoose.Schema(
    {
      question: {
        type: Number,
        required: true,
        ref: "questions",
      },
      answer: {
        type: String,
      },
    },
    { _id: false }
  );
  const response = (doc) => {
    return {
      question: doc.question,
      answer: doc.answer,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  };
  return $baseModel("solutions.solutions", schema, {
    responseFunc: response,
    // here you can add any option with in baseSchema
  });
}

const response = (doc, options) => {
  return {
    id: doc.id,
    solutions: doc.solutions,
    exam: doc.exam,
    student: doc.student,
    studentMark: doc.studentMark,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = $baseModel("solutions", schema, {
  responseFunc: response,
  // here you can add any option with in baseSchema
});
