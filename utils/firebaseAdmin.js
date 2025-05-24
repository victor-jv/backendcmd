const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

// Carrega as credenciais do Firebase a partir de uma variável de ambiente JSON stringificada
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { db };