const express = require('express');
const { db } = require('../utils/firebaseAdmin');

const router = express.Router();

// GET /comandas
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('comandas').get();
    const comandas = snapshot.docs.map(doc => ({ ...doc.data(), numero: doc.id }));
    res.json(comandas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar comandas' });
  }
});

// POST /comandas
router.post('/', async (req, res) => {
  try {
    const { numero, nome, status, createdAt } = req.body;
    await db.collection('comandas').doc(numero).set({ nome, status, createdAt });
    res.status(201).json({ message: 'Comanda salva com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar comanda' });
  }
});

// PUT /comandas/:numero ✅ NOVA ROTA
router.put('/:numero', async (req, res) => {
  try {
    const { numero } = req.params;
    const data = req.body;

    await db.collection('comandas').doc(numero).update(data);
    res.status(200).json({ message: 'Comanda atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar comanda:', err);
    res.status(500).json({ error: 'Erro ao atualizar comanda' });
  }
});

// PUT /comandas/:numero/itens (para salvar itens de pedidos)
router.put('/:numero/itens', async (req, res) => {
  try {
    const { numero } = req.params;
    const { itens } = req.body;

    await db.collection('comandas').doc(numero).update({ itens });
    res.status(200).json({ message: 'Itens salvos com sucesso' });
  } catch (err) {
    console.error('Erro ao salvar itens da comanda:', err);
    res.status(500).json({ error: 'Erro ao salvar itens da comanda' });
  }
});

// DELETE /comandas/:numero
router.delete('/:numero', async (req, res) => {
  try {
    await db.collection('comandas').doc(req.params.numero).delete();
    res.status(200).json({ message: 'Comanda excluída' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir comanda' });
  }
});

module.exports = router;

