const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const timestamp = new Date().toISOString();

  try {
    await axios.get('https://brasilapi.com.br/api/ibge/uf/v1', { timeout: 5000 });
    return res.status(200).json({
      status: 'healthy',
      versao: '1.0.0',
      timestamp,
    });
  } catch (_) {
    return res.status(200).json({
      status: 'degraded',
      versao: '1.0.0',
      timestamp,
      motivo: 'Serviço externo indisponível',
    });
  }
});

module.exports = router;
