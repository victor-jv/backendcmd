// server.js (ou index.js)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Rotas da sua aplicação
import itensRoutes from './routes/itens.js';
import categoriasRoutes from './routes/categorias.js';
import garconsRoutes from './routes/garcons.js';
import comandasRoutes from './routes/comandas.js';

dotenv.config();

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas públicas para ping/saúde (mantêm o Render acordado)
app.get('/', (_req, res) => {
  res.type('text').send('Servidor ativo 🚀');
});

app.get('/ping', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'backendcmd',
    now: new Date().toISOString(),
    uptime_s: Math.round(process.uptime())
  });
});

// Suas rotas de negócio
app.use('/itens', itensRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/garcons', garconsRoutes);
app.use('/comandas', comandasRoutes);

// 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
});

// Handler de erro (evita derrubar processo em exceções de rotas)
app.use((err, _req, res, _next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// Porta do Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
