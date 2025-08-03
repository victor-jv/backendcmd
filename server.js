import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itensRoutes from './routes/itens.js';
import categoriasRoutes from './routes/categorias.js';
import garconsRoutes from './routes/garcons.js';
import comandasRoutes from './routes/comandas.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/itens', itensRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/garcons', garconsRoutes);
app.use('/comandas', comandasRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🔥`));