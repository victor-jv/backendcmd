const express = require('express');
const multer = require('multer');
const { db } = require('../utils/firebaseAdmin'); // Já puxando certo

const router = express.Router();
const upload = multer();

// 🛒 Adicionar novo garçom
router.post('/', upload.none(), async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    const docRef = await db.collection('garcons').add({
      nome,
      createdAt: new Date()
    });

    res.status(201).json({ id: docRef.id, nome });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar garçom.' });
  }
});

// 🛒 Buscar todos os garçons
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('garcons').get();
    const garcons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(garcons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar garçons.' });
  }
});

// 🛒 Deletar garçom
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('garcons').doc(id).delete();
    res.status(200).json({ message: 'Garçom deletado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar garçom.' });
  }
});

// 🛒 Editar garçom
router.put('/:id', upload.none(), async (req, res) => {
  try {
    const { nome } = req.body;
    const { id } = req.params;

    if (!nome) {
      return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    // Atualizar o garçom
    await db.collection('garcons').doc(id).update({
      nome,
      updatedAt: new Date()  // Armazenar a data de edição
    });

    res.status(200).json({ id, nome });
  } catch (error) {
    console.error('Erro ao editar garçom:', error);
    res.status(500).json({ error: 'Erro ao editar garçom.' });
  }
});

module.exports = router;
