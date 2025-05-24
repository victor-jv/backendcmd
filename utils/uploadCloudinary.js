const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const dotenv = require('dotenv'); // Adicione esta linha
dotenv.config(); // Adicione esta linha para carregar .env localmente, se existir

// Configuração do Cloudinary usando variáveis de ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Função para subir imagem para o Cloudinary
const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'itens', // Pasta onde suas imagens ficam no Cloudinary
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Erro no upload do Cloudinary:', error);
          reject(error);
        } else {
          console.log('Upload realizado com sucesso:', result.secure_url);
          resolve(result.secure_url);
        }
      }
    );

    readableStream.pipe(uploadStream);
  });
};

module.exports = { uploadImageToCloudinary };