const router = require('express').Router()
const UserQuiz = require('../models/UserQuize');

router.get('/', function (req, res, next) {
  res.render('member/index')
});

// get all quizzes from userQuiz
router.get('/quizzes', function (req, res, next) {
  UserQuiz.find({}).populate({
    path: 'quiz',
    populate: {
      path: 'category'
    }
  }).populate({
    path: 'quiz',
    populate: {
      path: 'subCategory'
    }
  }).exec(function (err, quizzes) {

    res.render('member/quizzes', { quizList: quizzes })
  });
});

module.exports = router;