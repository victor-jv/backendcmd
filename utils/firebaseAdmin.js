const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

// ✅ O código foi alterado para ler o "Secret File" do Render.
const serviceAccount = require('/etc/secrets/firebase-credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { db };
