const { db } = require('../firebase');
const { collection, addDoc, updateDoc, deleteDoc, getDocs, query, where, doc, getDoc, setDoc } = require('firebase/firestore');

const createExpense = async (req, res) => {
  const { amount, category, date, paymentMethod, description } = req.body;
  try {
    const docRef = await addDoc(collection(db, 'expenses'), {
      amount,
      category,
      date: new Date(date),
      paymentMethod,
      description,
    });
    res.status(201).send({ id: docRef.id });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateExpense = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const expenseRef = doc(db, 'expenses', id);
    await updateDoc(expenseRef, updates);
    res.status(200).send('Expense updated');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const expenseRef = doc(db, 'expenses', id);
    await deleteDoc(expenseRef);
    res.status(200).send('Expense deleted');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getExpenses = async (req, res) => {
  try {
    const expensesSnapshot = await getDocs(collection(db, 'expenses'));
    const expenses = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(expenses);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getMonthlyBudget = async (req, res) => {
  const { month, year, category } = req.query;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  try {
    const q = query(
      collection(db, 'expenses'),
      where('category', '==', category),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    const expensesSnapshot = await getDocs(q);
    const totalAmount = expensesSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);

    const budgetRef = doc(db, 'budgets', `${category}_${year}_${month}`);
    const budgetDoc = await getDoc(budgetRef);
    const budgetLimit = budgetDoc.exists() ? budgetDoc.data().limit : 0;
    const feedback = totalAmount > budgetLimit ? 'Over budget' : 'Within budget';

    res.status(200).send({ category, totalAmount, budgetLimit, feedback });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const setMonthlyBudget = async (req, res) => {
  const { category, month, year, limit } = req.body;
  try {
    const budgetRef = doc(db, 'budgets', `${category}_${year}_${month}`);
    await setDoc(budgetRef, { category, month, year, limit });
    res.status(200).send({ category, month, year, limit });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenses,
  getMonthlyBudget,
  setMonthlyBudget,
};