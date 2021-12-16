const mongoose = require("mongoose");

const $baseModel = require("../$baseModel");

const schema = new mongoose.Schema(
  {
    tobic: String,
    course: String,
    duration: {
      type: Number,
      required: true,
    },
    teacher: {
      type: Number,
      required: true,
      ref: "user",
    },
    students: [
      {
        type: Number,
        ref: "user",
      },
    ],
    questions: [
      {
        type: Number,
        ref: "questions",
      },
    ],
  },
  { timestamps: true }
);

const response = (doc, options) => {
  return {
    id: doc.id,
    tobic: doc.tobic,
    course: doc.course,
    duration: doc.duration,
    teacher: doc.teacher,
    students: doc.students,
    questions: doc.questions,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = $baseModel("exams", schema, {
  responseFunc: response,
  // here you can add any option with in baseSchema
});
