const express = require('express');
const { db } = require('../utils/firebaseAdmin');

const router = express.Router();

// GET /comandas - Buscar todas as comandas
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('comandas').get();
    const comandas = snapshot.docs.map(doc => ({ 
      id: doc.id, // ✅ Renomeia 'numero' para 'id' para consistência
      ...doc.data() 
    }));
    res.json(comandas);
  } catch (err) {
    console.error('Erro ao buscar comandas:', err); // Adiciona log de erro no backend
    res.status(500).json({ error: 'Erro ao buscar comandas' });
  }
});

// POST /comandas - Criar nova comanda com número sequencial
router.post('/', async (req, res) => {
  try {
    const { nome, status, createdAt } = req.body;
    
    const counterRef = db.collection('counters').doc('comandas');
    let nextSequentialNumber;

    await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists) {
        nextSequentialNumber = 1;
        transaction.set(counterRef, { lastNumber: nextSequentialNumber });
      } else {
        nextSequentialNumber = counterDoc.data().lastNumber + 1;
        transaction.update(counterRef, { lastNumber: nextSequentialNumber });
      }
    });

    const docRef = await db.collection('comandas').add({ 
        nome, 
        status, 
        createdAt,
        numero_sequencial: nextSequentialNumber 
    });

    res.status(201).json({ 
        id: docRef.id, 
        numero_sequencial: nextSequentialNumber, 
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
