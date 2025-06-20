// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importação das suas rotas
const itensRoutes = require('./routes/itens');
const categoriasRoutes = require('./routes/categorias');
const garconsRoutes = require('./routes/garcons');
const comandasRoutes = require('./routes/comandas');
const authRoutes = require('./routes/auth'); // Já tínhamos adicionado

dotenv.config();

const app = express();

// ✅ --- INÍCIO DA NOVA CONFIGURAÇÃO DE CORS ---

// Define as opções de CORS de forma mais detalhada
const corsOptions = {
  origin: '*', // Permite requisições de QUALQUER origem. Para produção, o ideal é limitar ao seu domínio do frontend.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Lista de métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Lista de cabeçalhos permitidos na requisição
};

// Usa as opções de CORS
app.use(cors(corsOptions));

// O Express, com a configuração acima, já deve lidar com as requisições OPTIONS.
// Mas para garantir compatibilidade com todas as plataformas, podemos adicionar esta linha:
app.options('*', cors(corsOptions));

// ✅ --- FIM DA NOVA CONFIGURAÇÃO DE CORS ---


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uso das rotas
app.use('/', authRoutes);
app.use('/itens', itensRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/garcons', garconsRoutes);
app.use('/comandas', comandasRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🔥`));
