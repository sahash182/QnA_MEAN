// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),  // for data from the request body
    mongoose = require('mongoose');       // to interact with our db

// connect to mongodb
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/qna'
);

// configure body-parser
app.use(bodyParser.urlencoded({extended: true}));

//requuiring model
var Question = require('./models/question.js');
var Answer = require('./models/answer.js');

//Routes

//get question
app.get('/api/questions', function (req, res){
  Question.find({}, function (err, question){
    res.json(question);
  });
});

// create new question
app.post('/api/questions', function (req, res) {
  // create new question with data from the body of the request (`req.body`)
  // body should contain the question text itself
  console.log(req.body);
  var newQuestion = new Question({
    text: req.body.text
  });

  // save new question
  newQuestion.save(function (err, savedQuestion) {
    res.json(savedQuestion);
  });
});

// update question, but only the part(s) passed in in the request body
// not currently that exciting when question has only one attribute
app.put('/api/questions/:id', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find question in db by id
  Question.findOne({_id: targetId}, function (err, foundQuestion) {
    // update the question's text, if the new text passed in was truthy
    // otherwise keep the same text
    foundQuestion.text = req.body.text;

    // save updated question in db
    foundQuestion.save(function (err, savedQuestion) {
      res.json(savedQuestion);
    });
  });
});


// get one question by id
app.get('/api/questions/:id', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;
  // find question in db by id 
  Question.findOne({_id: targetId}, function (err, foundQuestion){
    res.json(foundQuestion);
  });
});


/////////////////////Another Way to Delete One   ////////////////////////
// //delete one another way.
// app.delete('/api/questions/:id', function (req, res) {
//    // set the value of the id
//   var targetId = req.params.id;
//   //find by id and remove from db.
//   Question.find({_id: targetId}).remove(function (err, dbres){
//     res.json(dbres);
//   });
// });


//delete one
app.delete('/api/questions/:id', function (req, res) {
   // set the value of the id
  var targetId = req.params.id;
  // find question in db by id and remove
  Question.findOneAndRemove({_id: targetId}, function (err, deletedQuestion) {
    res.json(deletedQuestion);
  });
});

//////////////////////////EMBEDDED ROUTES /////////////////////////////////


//route to create answer embedded in question
app.post('/api/questions/:questionId/answers', function (req, res){
  //create new answer (from form params)
  var newAnswer = new Answer(req.body.answer);
  //find question by url params
  var questionId = req.params.questionId;
  Question.findOne({_id: questionId}, function (err, foundQuestion){
    //push the answer into question.answer
    foundQuestion.answers.push(newAnswer);
    foundQuestion.save(function (err, savedQuestion){
      res.json(newAnswer);
    });
  });
});


// route to update answer embedded in question
app.put('/api/questions/:questionId/answers/:id', function (req, res){
// find question by id 
//find answer by id embedded in question 
var questionId = req.params.questionId;
var answerId = req.params.id;

  Question.findOne({_id: questionId}, function (err, foundQuestion){
    var foundAnswer = foundQuestion.answers.id(answerId);

    //update answer's content
    foundAnswer.content = req.body.answer.content;

    //save question
    foundQuestion.save(function (err, savedQuestion){
      //respond with updated answer
      res.json(foundAnswer);
    });
  });
});


//delete answer embedded in question
app.delete('/api/questions/:questionId/answers/:id', function (req, res){
// find question by id 
//find answer by id embedded in question 
var questionId = req.params.questionId;
var answerId = req.params.id;

  Question.findOne({_id: questionId}, function (err, foundQuestion){
    var foundAnswer = foundQuestion.answers.id(answerId);

    //delete found answer
    foundAnswer.remove();

    //save the question after removing the answer
    foundQuestion.save(function (err, savedQuestion){
      res.json(savedQuestion);
    }); 
  });
});




// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('server started on localhost:3000');
});