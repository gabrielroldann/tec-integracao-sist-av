const express = require('express');
const cors = require('cors');

const climaRoutes = require('./routes/clima');
const cidadesRoutes = require('./routes/cidades');
const healthRoutes = require('./routes/health');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/clima', climaRoutes);
app.use('/api/v1/cidades', cidadesRoutes);

module.exports = app;
