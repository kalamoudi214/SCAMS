const router = require('express').Router()

// Models
const Category = require('../models/Category');
const sub = require('../models/SubCategory');
const Question = require('../models/Question')
const Quiz = require('../models/Quiz');
const UsersModel = require('../models/user');
const UserQuiz = require('../models/UserQuize');

// Static Pages ================================================================
router.get('/', function (req, res, next) {
    res.render('manager/index')
});

router.get('/quizzes', function (req, res, next) {
    Quiz.find({}).populate(['category', 'subCategory']).exec(function (err, quizzes) {
        res.render('manager/quizzes', { quizList: quizzes })
    });
})

// return addquiz page with all categories and sub categories from database
router.get('/addquiz', function (req, res, next) {
    Category.find({}).then(categories => {
        sub.find({}).then(subCategories => {
            res.render('manager/addquiz', { allCategories: categories, allSubCategories: subCategories });
        })
    });
})

router.post('/addquiz', function (req, res, next) {
    let quizName = req.body.name;
    let quizDesc = req.body.description;
    let quizCategoryId = req.body.category;
    let quizSubCatId = req.body.subCategory;
    var quizQuestions = [];
    for (let i = 0; i < 5; i++) {
        var q = new Question({
            statment: req.body.Statement[i],
            type: req.body.type[i],
            options: [
                req.body.optionA[i],
                req.body.optionB[i],
                req.body.optionC[i],
                req.body.optionD[i]
            ],
            answer: req.body.answer[i]
        })
        quizQuestions.push(q);
    }
    // create new quiz on database
    new Quiz({
        name: quizName,
        description: quizDesc,
        subCategory: quizSubCatId,
        category: quizCategoryId,
        questions: quizQuestions
    }).save(function (err, addedQuiz) {
        UsersModel.find({ role: "member" }).then(function (list) {
            if (list.length > 0) {
                list.forEach(emp => {
                    new UserQuiz({
                        user: emp,
                        quiz: addedQuiz,
                        visiable: true,
                        solved: false
                    }).save().then(() => {
                        // populate get all category data not only _id
                        // return to quizzes page with new list
                        Quiz.find({}).populate(['category', 'subCategory']).exec(function (err, quizzes) {
                            res.render('manager/quizzes', { quizList: quizzes })
                        });
                    });
                });
            }
            else {
                Quiz.find({}).populate(['category', 'subCategory']).exec(function (err, quizzes) {
                    res.render('manager/quizzes', { quizList: quizzes })
                });
            }
        });
    });
});

module.exports = router;