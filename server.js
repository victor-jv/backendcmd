const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const itensRoutes = require('./routes/itens');
const categoriasRoutes = require('./routes/categorias');
const garconsRoutes = require('./routes/garcons');
const comandasRoutes = require('./routes/comandas');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 👈 ESSA LINHA É ESSENCIAL

app.use('/itens', itensRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/garcons', garconsRoutes);
app.use('/comandas', comandasRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🔥`));
