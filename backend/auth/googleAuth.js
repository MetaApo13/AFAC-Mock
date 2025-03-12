require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const { signInWithCredential, GoogleAuthProvider } = require('firebase/auth');
const { auth } = require('../config');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    // Verify the access token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    // Create a Firebase credential with the ID token
    const credential = GoogleAuthProvider.credential(token);
    const userCredential = await signInWithCredential(auth, credential);
    res.status(200).send(userCredential.user);
  } catch (error) {a
    res.status(400).send(error.message);
  }
};

module.exports = { googleLogin };