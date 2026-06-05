const express = require('express');
const router = express.Router();
const { buscarCidadesPorUF } = require('../services/apiService');

const UFS_VALIDAS = new Set([
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA',
  'MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN',
  'RO','RR','RS','SC','SE','SP','TO',
]);

router.get('/:sigla_uf', async (req, res) => {
  const siglaRaw = req.params.sigla_uf;
  const siglaUF = siglaRaw.toUpperCase().trim();

  if (!/^[A-Z]{2}$/.test(siglaUF)) {
    return res.status(400).json({
      erro: true,
      codigo: 'SIGLA_UF_INVALIDA',
      mensagem: 'A sigla do estado deve conter exatamente 2 letras',
      sigla_uf_informada: siglaRaw,
    });
  }

  if (!UFS_VALIDAS.has(siglaUF)) {
    return res.status(404).json({
      erro: true,
      codigo: 'UF_NAO_ENCONTRADA',
      mensagem: 'Estado com a sigla informada não foi encontrado',
      sigla_uf_informada: siglaRaw,
    });
  }

  let limite = parseInt(req.query.limite, 10);
  if (isNaN(limite) || limite < 1) limite = 10;
  if (limite > 100) limite = 100;

  try {
    const cidades = await buscarCidadesPorUF(siglaUF);

    const cidadesFiltradas = cidades
      .slice(0, limite)
      .map((c) => ({ nome: c.nome }));

    return res.status(200).json({
      uf: siglaUF,
      quantidade_retornada: cidadesFiltradas.length,
      cidades: cidadesFiltradas,
      consultado_em: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[/cidades] Erro externo:', err.message);

    if (err.response?.status === 404) {
      return res.status(404).json({
        erro: true,
        codigo: 'UF_NAO_ENCONTRADA',
        mensagem: 'Estado com a sigla informada não foi encontrado',
        sigla_uf_informada: siglaRaw,
      });
    }

    return res.status(503).json({
      erro: true,
      codigo: 'SERVICO_EXTERNO_INDISPONIVEL',
      mensagem: 'Não foi possível obter dados do serviço externo. Tente novamente em alguns instantes',
      servico: 'BrasilAPI',
    });
  }
});

module.exports = router;
