const express = require('express');
const {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenses,
  getMonthlyBudget,
  setMonthlyBudget,
} = require('../controllers/expenseController');

const router = express.Router();

router.post('/expenses', createExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);
router.get('/expenses', getExpenses);
router.get('/budget', getMonthlyBudget);
router.post('/budget', setMonthlyBudget);

module.exports = (app) => {
  app.use('/api', router);
};