// models/question.js

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    Answer = require('./answer');

var QuestionSchema = new Schema({
  text: String,
  answers: [Answer.schema] //Embedded

  //for ref notes
  // answer: [{
  //   type: Schema.Types.ObjectID,
  //   ref: 'Answer'
  // }]
});

var Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;