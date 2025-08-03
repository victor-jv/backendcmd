import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { supabase } from '../utils/supabaseClient.js';
import { uploadImageToCloudinary } from '../utils/uploadCloudinary.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Configuração do Cloudinary (caso necessário)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ➕ Criar item
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, categoriaId } = req.body;
    const file = req.file;

    if (!name || !price || !categoriaId) {
      return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    let imageUrl = '';
    if (file) {
      imageUrl = await uploadImageToCloudinary(file.buffer);
    }

    const { data, error } = await supabase
      .from('itens')
      .insert([{ name, price, categoria_id: categoriaId, image_url: imageUrl }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Erro ao adicionar item:', error.message);
    res.status(500).json({ error: 'Erro ao adicionar item.' });
  }
});

// 📄 Buscar todos os itens
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('itens')
      .select('id, name, price, image_url, categoria_id')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar itens:', error.message);
    res.status(500).json({ error: 'Erro ao buscar itens.' });
  }
});

// ✏️ Editar item
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoriaId } = req.body;
    const file = req.file;

    const updatedData = { updated_at: new Date() };
    if (name) updatedData.name = name;
    if (price) updatedData.price = price;
    if (categoriaId) updatedData.categoria_id = categoriaId;

    if (file) {
      updatedData.image_url = await uploadImageToCloudinary(file.buffer);
    }

    const { data, error } = await supabase
      .from('itens')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao editar item:', error.message);
    res.status(500).json({ error: 'Erro ao editar item.' });
  }
});

// 🗑️ Deletar item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar item
    const { data: item, error: findError } = await supabase
      .from('itens')
      .select('image_url')
      .eq('id', id)
      .single();

    if (findError || !item) {
      return res.status(404).json({ error: 'Item não encontrado.' });
    }

    // Deletar imagem do Cloudinary, se houver
    if (item.image_url) {
      const imageId = item.image_url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(imageId);
    }

    // Deletar item do banco
    const { error: deleteError } = await supabase
      .from('itens')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.status(200).json({ message: 'Item e imagem deletados com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir item:', error.message);
    res.status(500).json({ error: 'Erro ao excluir item.' });
  }
});

export default router;

