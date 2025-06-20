const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

// Inicializar diretamente pelo caminho da chave
admin.initializeApp({
  credential: admin.credential.cert(require(process.env.GOOGLE_APPLICATION_CREDENTIALS)),
});

const db = admin.firestore();

module.exports = { db };
