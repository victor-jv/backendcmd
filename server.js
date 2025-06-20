const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente do .env
dotenv.config();

// Importação das rotas
const itensRoutes = require('./routes/itens');
const categoriasRoutes = require('./routes/categorias');
const garconsRoutes = require('./routes/garcons');
const comandasRoutes = require('./routes/comandas');
const authRoutes = require('./routes/auth');

const app = express();

// ✅ --- CORS Configurado para produção e dev ---
// Para testes locais, '*' funciona, mas para produção use domínio real.
const corsOptions = {
  origin: '*', // ex: 'https://meusite.com' no deploy
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight

// 🧠 Middlewares para JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📦 Rotas
app.use('/', authRoutes);
app.use('/itens', itensRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/garcons', garconsRoutes);
app.use('/comandas', comandasRoutes);

// 🚀 Inicializa servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🔥`);
});

