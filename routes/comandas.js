const express = require('express');
const { db } = require('../utils/firebaseAdmin'); // Já puxando db corretamente

const router = express.Router();

// GET /comandas - Buscar comandas com filtro de status (ou todas)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query; // ✅ Aceita parâmetro de query 'status'
    let queryRef = db.collection('comandas');

    if (status) {
      queryRef = queryRef.where('status', '==', status); // ✅ Filtra por status no Firestore
    }

    const snapshot = await queryRef.get(); // Executa a query
    const comandas = snapshot.docs.map(doc => ({ 
      id: doc.id, // Retorna o ID real do documento do Firebase como 'id'
      ...doc.data() 
    }));
    res.json(comandas);
  } catch (err) {
    console.error('Erro ao buscar comandas:', err); 
    res.status(500).json({ error: 'Erro ao buscar comandas' });
  }
});

// POST /comandas - Criar nova comanda com número sequencial
router.post('/', async (req, res) => {
  try {
    const { nome, status, createdAt } = req.body; // Remove 'numero' do req.body
    
    // Obter e incrementar o contador sequencial
    const counterRef = db.collection('counters').doc('comandas');
    let nextSequentialNumber;

    // Usar uma transação para garantir que o contador é atomicamente incrementado
    await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists) {
        // Se o contador não existe, inicialize-o
        nextSequentialNumber = 1;
        transaction.set(counterRef, { lastNumber: nextSequentialNumber });
      } else {
        nextSequentialNumber = counterDoc.data().lastNumber + 1;
        transaction.update(counterRef, { lastNumber: nextSequentialNumber });
      }
    });

    // Adicionar a comanda com o número sequencial gerado
    // O doc.id do Firebase continua sendo gerado automaticamente
    const docRef = await db.collection('comandas').add({ 
        nome, 
        status, 
        createdAt,
        numero_sequencial: nextSequentialNumber // ✅ Novo campo para o número sequencial
    });

    res.status(201).json({ 
        id: docRef.id, // Retorna o ID real do Firebase
        numero_sequencial: nextSequentialNumber, // ✅ Retorna o número sequencial
        nome, status, createdAt 
    });
  } catch (err) {
    console.error('Erro ao salvar comanda:', err);
    res.status(500).json({ error: 'Erro ao salvar comanda' });
  }
});

// PUT /comandas/:numero (Firebase Doc ID) - Usado para atualizar status/total
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
    res.status(500).json({ error: 'Erro ao excluir comanda:' , err});
  }
});

module.exports = router;
