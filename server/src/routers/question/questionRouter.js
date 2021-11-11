import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Question from '../../models/questionSchema.js';

const questionRouter = express.Router();

//get data
questionRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const createQuestion = await Question.find();
    res.send({ createQuestion });
  })
);

//create new data
questionRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const question = new Question({
      questionNumber: req.body.questionNumber,
      questionQuestion: req.body.questionQuestion,
      questionOptions: req.body.questionOptions,
      questionAnswer: req.body.questionAnswer,
    });
    const createdQuestion = await question.save();
    res.send({
      message: 'Question Created',
      question: createdQuestion,
    });
  })
);

// update
questionRouter.put(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);

    console.log(req.body);
    if (question) {
      question.questionNumber = req.body.questionNumber;
      question.questionQuestion = req.body.questionQuestion;
      question.questionOptions = req.body.questionOptions;
      question.questionAnswer = req.body.questionAnswer;

      const updatedQuestion = await question.save();
      res.send({
        message: 'Question Updated',
        question: updatedQuestion,
      });
    } else {
      res.status(404).send({ message: 'Question Not Found' });
    }
  })
);

//remove
questionRouter.delete(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    if (question) {
      const deleteQuestion = await question.remove();
      res.send({
        message: 'Question Deleted',
        quiquestionz: deleteQuestion,
      });
    } else {
      res.status(404).send({ message: 'Question Not Found' });
    }
  })
);

export default questionRouter;