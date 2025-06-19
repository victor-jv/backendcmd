// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importação das rotas existentes
const itensRoutes = require('./routes/itens');
const categoriasRoutes = require('./routes/categorias');
const garconsRoutes = require('./routes/garcons');
const comandasRoutes = require('./routes/comandas');
// ✅ 1. Importe a nova rota de autenticação
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 2. Use a nova rota de autenticação
// Qualquer rota definida em auth.js será acessível a partir da raiz '/'
// Ex: POST /login
app.use('/', authRoutes);

// Uso das rotas existentes
app.use('/itens', itensRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/garcons', garconsRoutes);
app.use('/comandas', comandasRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🔥`));
