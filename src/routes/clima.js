const express = require('express');
const router = express.Router();
const { buscarClimaCompleto } = require('../services/apiService');

router.get('/:nome_cidade', async (req, res) => {
  const { nome_cidade } = req.params;

  if (!nome_cidade || nome_cidade.trim().length < 2) {
    return res.status(400).json({
      erro: true,
      codigo: 'NOME_INVALIDO',
      mensagem: 'O nome da cidade deve conter pelo menos 2 caracteres',
      nome_informado: nome_cidade || '',
    });
  }

  try {
    const resultado = await buscarClimaCompleto(nome_cidade.trim());

    if (!resultado) {
      return res.status(404).json({
        erro: true,
        codigo: 'CIDADE_NAO_ENCONTRADA',
        mensagem: 'Nenhuma cidade encontrada com o nome informado',
        nome_informado: nome_cidade,
      });
    }

    return res.status(200).json(resultado);
  } catch (err) {
    console.error('[/clima] Erro externo:', err.message);

    const resData = err.response?.data;
    if (
      err.response?.status === 404 &&
      resData?.name === 'NO_CITY_NOT_FOUND'
    ) {
      return res.status(404).json({
        erro: true,
        codigo: 'CIDADE_NAO_ENCONTRADA',
        mensagem: 'Nenhuma cidade encontrada com o nome informado',
        nome_informado: nome_cidade,
      });
    }

    const servico = 'BrasilAPI';

    return res.status(503).json({
      erro: true,
      codigo: 'SERVICO_EXTERNO_INDISPONIVEL',
      mensagem: 'Não foi possível obter dados do serviço externo. Tente novamente em alguns instantes',
      servico,
    });
  }
});

module.exports = router;
