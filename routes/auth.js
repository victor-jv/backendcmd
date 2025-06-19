// routes/auth.js

const express = require('express');
const axios = require('axios');
const { db } = require('../utils/firebaseAdmin'); // Para buscar a permissão (role)

const router = express.Router();

// ❗ IMPORTANTE: Você precisa da sua Web API Key do Firebase.
// Vá em Configurações do Projeto > Geral > Seus apps > App da Web.
// Copie a "apiKey" e cole aqui ou, melhor ainda, em seu arquivo .env
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'SUA_WEB_API_KEY';

// Rota POST /login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

  try {
    // 1. Tenta autenticar no Firebase Auth
    const firebaseResponse = await axios.post(authUrl, {
      email: email,
      password: senha,
      returnSecureToken: true,
    });

    const { idToken, localId } = firebaseResponse.data; // localId é o UID do usuário

    // 2. Busca o documento do usuário no Firestore para pegar a permissão (role)
    const userDocRef = db.collection('users').doc(localId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      // Se o usuário existe no Auth mas não no Firestore, retorna erro ou um role padrão
      return res.status(404).json({ message: 'Registro de usuário não encontrado no banco de dados.' });
    }

    const userData = {
      uid: localId,
      email: userDoc.data().email,
      role: userDoc.data().role,
    };

    // 3. Envia a resposta de sucesso para o frontend
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: idToken, // O token gerado pelo Firebase
      user: userData,
    });

  } catch (error) {
    console.error('Erro de autenticação no backend:', error.response ? error.response.data : error.message);
    // Erro de credenciais inválidas vindo do Firebase
    if (error.response && error.response.data.error.message === 'INVALID_LOGIN_CREDENTIALS') {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }
    // Outros erros
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

module.exports = router;
