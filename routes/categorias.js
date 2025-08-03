// Substitua o require por import
import { Router } from 'express';
import { supabase } from '../utils/supabaseClient.js'; // Importa o novo cliente

const router = Router();

// ➕ Adicionar categoria
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });
    }

    const { data, error } = await supabase
      .from('categorias')
      .insert([{ name }]) // Insere um novo registo
      .select() // Retorna o registo inserido
      .single(); // Garante que retorna apenas um objeto, não um array

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error.message);
    res.status(500).json({ error: 'Erro ao adicionar categoria.' });
  }
});

// 📄 Listar categorias
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('*') // Seleciona todas as colunas
      .order('created_at', { ascending: false }); // Ordena pela data de criação

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error.message);
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

    const { data, error } = await supabase
      .from('categorias')
      .update({ name, updated_at: new Date() }) // Atualiza o nome
      .eq('id', id) // Onde o id é igual ao id do parâmetro
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erro ao editar categoria:', error.message);
    res.status(500).json({ error: 'Erro ao editar categoria.' });
  }
});

// 🗑️ Deletar categoria
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Categoria deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error.message);
    res.status(500).json({ error: 'Erro ao deletar categoria.' });
  }
});

// module.exports = router; // Mude para export default
export default router;