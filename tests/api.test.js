const request = require('supertest');
const app = require('../src/app');

jest.setTimeout(30000);

describe('GET /api/v1/health', () => {
  test('deve retornar status 200 com campo status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(['healthy', 'degraded']).toContain(res.body.status);
    expect(res.body).toHaveProperty('versao');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('GET /api/v1/clima/:nome_cidade', () => {
  test('deve retornar dados climáticos para cidade válida (Fortaleza)', async () => {
    const res = await request(app).get('/api/v1/clima/Fortaleza');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('nome');
    expect(res.body).toHaveProperty('estado');
    expect(res.body).toHaveProperty('clima');
    expect(res.body.clima).toHaveProperty('temperatura_min');
    expect(res.body.clima).toHaveProperty('temperatura_max');
    expect(res.body.clima).toHaveProperty('condicao');
    expect(res.body).toHaveProperty('consultado_em');
  });

  test('deve retornar 404 para cidade inexistente', async () => {
    const res = await request(app).get('/api/v1/clima/CidadeQueNaoExisteXYZ123');
    expect(res.status).toBe(404);
    expect(res.body.erro).toBe(true);
    expect(res.body.codigo).toBe('CIDADE_NAO_ENCONTRADA');
    expect(res.body).toHaveProperty('nome_informado');
  });

  test('deve retornar 400 para nome muito curto', async () => {
    const res = await request(app).get('/api/v1/clima/X');
    expect(res.status).toBe(400);
    expect(res.body.erro).toBe(true);
    expect(res.body.codigo).toBe('NOME_INVALIDO');
  });
});

describe('GET /api/v1/cidades/:sigla_uf', () => {
  test('deve retornar lista de cidades para UF válida (CE)', async () => {
    const res = await request(app).get('/api/v1/cidades/CE');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('uf', 'CE');
    expect(res.body).toHaveProperty('cidades');
    expect(Array.isArray(res.body.cidades)).toBe(true);
    expect(res.body.cidades.length).toBeGreaterThan(0);
    expect(res.body.cidades[0]).toHaveProperty('nome');
  });

  test('deve respeitar o parâmetro ?limite', async () => {
    const res = await request(app).get('/api/v1/cidades/SP?limite=5');
    expect(res.status).toBe(200);
    expect(res.body.cidades.length).toBeLessThanOrEqual(5);
    expect(res.body.quantidade_retornada).toBeLessThanOrEqual(5);
  });

  test('deve retornar 404 para UF inexistente', async () => {
    const res = await request(app).get('/api/v1/cidades/XX');
    expect(res.status).toBe(404);
    expect(res.body.erro).toBe(true);
    expect(res.body.codigo).toBe('UF_NAO_ENCONTRADA');
  });

  test('deve retornar 400 para sigla UF inválida', async () => {
    const res = await request(app).get('/api/v1/cidades/ceara');
    expect(res.status).toBe(400);
    expect(res.body.erro).toBe(true);
    expect(res.body.codigo).toBe('SIGLA_UF_INVALIDA');
  });
});
