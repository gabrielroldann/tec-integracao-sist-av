const axios = require('axios');

const BRASIL_API = 'https://brasilapi.com.br/api';

async function buscarCidadesPorUF(siglaUF) {
  const url = `${BRASIL_API}/ibge/municipios/v1/${siglaUF.toUpperCase()}`;
  const { data } = await axios.get(url, { timeout: 8000 });
  return data;
}

function normalizar(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

async function buscarCidadeCPTEC(nomeCidade) {
  const url = `${BRASIL_API}/cptec/v1/cidade/${encodeURIComponent(nomeCidade)}`;
  const { data } = await axios.get(url, { timeout: 8000 });

  if (!data || data.length === 0) return null;

  const nomeNorm = normalizar(nomeCidade);
  const exato = data.find((c) => normalizar(c.nome) === nomeNorm);
  return exato || data[0];
}

async function buscarPrevisaoCPTEC(idCidade) {
  const url = `${BRASIL_API}/cptec/v1/clima/previsao/${idCidade}`;
  const { data } = await axios.get(url, { timeout: 8000 });

  const hoje = data.clima[0];
  return {
    temperatura_min: hoje.min,
    temperatura_max: hoje.max,
    condicao: hoje.condicao_desc,
    unidades: { temperatura: '°C' },
  };
}

async function buscarClimaCompleto(nomeCidade) {
  const cidade = await buscarCidadeCPTEC(nomeCidade);
  if (!cidade) return null;

  const clima = await buscarPrevisaoCPTEC(cidade.id);

  return {
    nome: cidade.nome,
    estado: cidade.estado,
    clima,
    consultado_em: new Date().toISOString(),
  };
}

module.exports = {
  buscarCidadesPorUF,
  buscarClimaCompleto,
};
