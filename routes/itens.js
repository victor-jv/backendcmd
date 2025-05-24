const express = require('express');
const multer = require('multer');
const { uploadImageToCloudinary } = require('../utils/uploadCloudinary');
const { db } = require('../utils/firebaseAdmin');
const { v2: cloudinary } = require('cloudinary');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🛒 Adicionar novo item
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

    const docRef = await db.collection('itens').add({
      name,
      price,
      categoriaId,
      image: imageUrl,
      createdAt: new Date(),
    });

    res.status(201).json({ id: docRef.id, name, price, categoriaId, image: imageUrl });
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    res.status(500).json({ error: 'Erro ao adicionar item.' });
  }
});

// 🛒 Buscar todos os itens
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('itens').orderBy('createdAt', 'desc').get();
    const itens = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(itens);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ error: 'Erro ao buscar itens.' });
  }
});

// 🛒 Deletar item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const itemSnapshot = await db.collection('itens').doc(id).get();
    const itemData = itemSnapshot.data();

    if (!itemSnapshot.exists) {
      return res.status(404).json({ error: 'Item não encontrado.' });
    }

    if (itemData.image) {
      const imageId = itemData.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(imageId);
    }

    await db.collection('itens').doc(id).delete();
    res.status(200).json({ message: 'Item e imagem deletados com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir item:', error);
    res.status(500).json({ error: 'Erro ao excluir item e imagem.' });
  }
});

// 🛒 Editar item
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoriaId } = req.body;
    const file = req.file;

    const updatedData = {};

    if (name) updatedData.name = name;
    if (price) updatedData.price = price;
    if (categoriaId) updatedData.categoriaId = categoriaId;

    if (file) {
      const imageUrl = await uploadImageToCloudinary(file.buffer);
      updatedData.image = imageUrl;
    }

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: 'Nenhuma informação para atualizar!' });
    }

    updatedData.updatedAt = new Date();

    await db.collection('itens').doc(id).update(updatedData);

    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error('Erro ao editar item:', error);
    res.status(500).json({ error: 'Erro ao editar item.' });
  }
});

module.exports = router;
