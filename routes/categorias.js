const express = require('express');
const { db } = require('../utils/firebaseAdmin');

const router = express.Router();

// ➕ Adicionar categoria
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });
    }

    const docRef = await db.collection('categorias').add({
      name,
      createdAt: new Date(),
    });

    res.status(201).json({ id: docRef.id, name });
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    res.status(500).json({ error: 'Erro ao adicionar categoria.' });
  }
});

// 📄 Listar categorias
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('categorias').orderBy('createdAt', 'desc').get();
    const categorias = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias.' });
  }
});

// ✏️ Editar categoria
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });
    }

    await db.collection('categorias').doc(id).update({
      name,
      updatedAt: new Date(),
    });

    res.json({ id, name });
  } catch (error) {
    console.error('Erro ao editar categoria:', error);
    res.status(500).json({ error: 'Erro ao editar categoria.' });
  }
});

// 🗑️ Deletar categoria
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('categorias').doc(id).delete();

    res.json({ message: 'Categoria deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ error: 'Erro ao deletar categoria.' });
  }
});

module.exports = router;
