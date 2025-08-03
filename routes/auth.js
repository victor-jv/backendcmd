// routes/auth.js
const express = require('express');
const axios = require('axios');
const { db } = require('../utils/firebaseAdmin');

const router = express.Router();

// Pega a API Key do Firebase do arquivo .env
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

  try {
    // 1. Autenticação via Firebase Auth
    const firebaseResponse = await axios.post(authUrl, {
      email,
      password: senha,
      returnSecureToken: true,
    });

    const { idToken, localId } = firebaseResponse.data;

    // 2. Busca o usuário no Firestore
    const userDoc = await db.collection('users').doc(localId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Registro de usuário não encontrado no banco de dados.' });
    }

    const userData = {
      uid: localId,
      email: userDoc.data().email,
      role: userDoc.data().role,
    };

    // 3. Retorna sucesso com token + dados
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: idToken,
      user: userData,
    });

  } catch (error) {
    console.error('Erro de autenticação no backend:', error.response ? error.response.data : error.message);

    if (error.response?.data?.error?.message === 'INVALID_LOGIN_CREDENTIALS') {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

module.exports = router;

