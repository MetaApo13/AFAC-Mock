const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { auth } = require('../config');

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    res.status(201).send(userCredential.user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    res.status(200).send(userCredential.user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { registerUser, loginUser };