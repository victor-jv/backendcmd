import { Router } from 'express';
import { supabase } from '../utils/supabaseClient.js';

const router = Router();

// ROTA GET: Buscar todas as comandas
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('comandas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar comandas:', err.message);
    res.status(500).json({ error: 'Erro ao buscar comandas' });
  }
});

// ✅ NOVA ROTA GET: Buscar uma comanda específica por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('comandas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar comanda específica:', error.message);
      return res.status(404).json({ error: 'Comanda não encontrada' });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro interno ao buscar comanda:', err.message);
    res.status(500).json({ error: 'Erro interno ao buscar comanda' });
  }
});

// ROTA POST: Criar uma nova comanda
router.post('/', async (req, res) => {
  try {
    const { nome, status } = req.body;

    if (!nome || !status) {
      return res.status(400).json({ error: 'Nome e status são obrigatórios.' });
    }

    const agora = new Date().toISOString();

    const novaComanda = {
      nome,
      status,
      itens: [],
      total: 0,
      dataAbertura: agora,
      created_at: agora,
    };

    const { data, error } = await supabase
      .from('comandas')
      .insert([novaComanda])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error('Erro ao salvar comanda:', err.message);
    res.status(500).json({ error: 'Erro ao salvar comanda' });
  }
});

// ROTA PUT: Atualizar status ou nome de uma comanda
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, status } = req.body;

    const updatedData = { updated_at: new Date().toISOString() };
    if (nome) updatedData.nome = nome;
    if (status) updatedData.status = status;

    const { data, error } = await supabase
      .from('comandas')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error('Erro ao atualizar comanda:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar comanda' });
  }
});

// ROTA PUT: Salvar/substituir os itens de uma comanda
router.put('/:id/itens', async (req, res) => {
  try {
    const { id } = req.params;
    const { itens } = req.body;

    if (!Array.isArray(itens)) {
      return res.status(400).json({ error: 'O campo "itens" deve ser um array.' });
    }

    const { data, error } = await supabase
      .from('comandas')
      .update({ itens, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error('Erro ao salvar itens da comanda:', err.message);
    res.status(500).json({ error: 'Erro ao salvar itens da comanda' });
  }
});

// ROTA DELETE: Excluir uma comanda
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('comandas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ message: 'Comanda excluída' });
  } catch (err) {
    console.error('Erro ao excluir comanda:', err.message);
    res.status(500).json({ error: 'Erro ao excluir comanda' });
  }
});

export default router;
