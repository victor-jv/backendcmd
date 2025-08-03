import { Router } from 'express';
import { supabase } from '../utils/supabaseClient.js';

const router = Router();

// ➕ Criar garçom
router.post('/', async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'O nome do garçom é obrigatório!' });
    }

    const { data, error } = await supabase
      .from('garcons')
      .insert([{ nome, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Erro ao adicionar garçom:', error.message);
    res.status(500).json({ error: 'Erro interno ao adicionar garçom.' });
  }
});

// 📄 Buscar todos os garçons
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('garcons')
      .select('id, nome, created_at')
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao buscar garçons:', error.message);
    res.status(500).json({ error: 'Erro interno ao buscar garçons.' });
  }
});

// ✏️ Atualizar garçom
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'O nome do garçom é obrigatório!' });
    }

    const { data, error } = await supabase
      .from('garcons')
      .update({ nome, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao editar garçom:', error.message);
    res.status(500).json({ error: 'Erro interno ao editar garçom.' });
  }
});

// 🗑️ Deletar garçom
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('garcons')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ message: 'Garçom deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar garçom:', error.message);
    res.status(500).json({ error: 'Erro interno ao deletar garçom.' });
  }
});

export default router;
