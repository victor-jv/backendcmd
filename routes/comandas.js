const express = require('express');
const { db } = require('../utils/firebaseAdmin');

const router = express.Router();

// GET /comandas - Buscar todas as comandas
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('comandas').get();
    // ✅ Retorna o ID do documento do Firebase como 'id'
    const comandas = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    res.json(comandas);
  } catch (err) {
    console.error('Erro ao buscar comandas:', err); 
    res.status(500).json({ error: 'Erro ao buscar comandas' });
  }
});

// POST /comandas - Criar nova comanda
router.post('/', async (req, res) => {
  try {
    const { numero, nome, status, createdAt } = req.body; // 'numero' é o ID gerado no frontend
    
    // Salva a comanda usando o 'numero' do frontend como ID do documento
    await db.collection('comandas').doc(numero).set({ nome, status, createdAt });

    res.status(201).json({ 
        id: numero, // Retorna o ID que foi usado (do frontend) como 'id'
        nome, status, createdAt 
    });
  } catch (err) {
    console.error('Erro ao salvar comanda:', err);
    res.status(500).json({ error: 'Erro ao salvar comanda' });
  }
});

// PUT /comandas/:numero (Firebase Doc ID)
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

// DELETE /comandas/:numero (Firebase Doc ID)
router.delete('/:numero', async (req, res) => {
  try {
    await db.collection('comandas').doc(req.params.numero).delete();
    res.status(200).json({ message: 'Comanda excluída' });
  } catch (err) {
    console.error('Erro ao excluir comanda:', err);
    res.status(500).json({ error: 'Erro ao excluir comanda' });
  }
});

module.exports = router;
