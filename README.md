# N703 — API de Agregação de Dados Climáticos e Geográficos

API REST que agrega dados de APIs públicas para fornecer informações geográficas e climáticas de cidades brasileiras. Desenvolvida para a disciplina **Técnicas de Integração de Sistemas (N703)** — UNIFOR 2026/1.

## Tecnologias

- **Node.js** v22+
- **Express** — framework HTTP
- **Axios** — cliente HTTP para consumo de APIs externas
- **Jest + Supertest** — testes automatizados

## APIs integradas

| API | Uso |
|-----|-----|
| [BrasilAPI / IBGE](https://brasilapi.com.br/docs#tag/IBGE) | Busca de municípios por nome e listagem por UF |
| [Nominatim / OpenStreetMap](https://nominatim.org/release-docs/latest/api/Search/) | Geocodificação dinâmica (lat/lon) pelo nome da cidade |
| [Open-Meteo](https://open-meteo.com/en/docs) | Dados climáticos por coordenadas (temperatura, condição do tempo) |

## Instalação

```bash
# 1. Clonar o repositório
git clone <URL_DO_REPOSITORIO>
cd <nome-da-pasta>

# 2. Instalar dependências
npm install

# 3. Iniciar a API
npm start
```

A API ficará disponível em `http://localhost:3000`.

## Endpoints

### `GET /api/v1/health`
Verifica o status da API.

**Resposta:**
```json
{
  "status": "healthy",
  "versao": "1.0.0",
  "timestamp": "2026-06-05T14:30:00.000Z"
}
```

---

### `GET /api/v1/clima/{nome_cidade}`
Retorna informações geográficas e climáticas de uma cidade brasileira.

**Parâmetros:** `nome_cidade` (string, mínimo 2 caracteres)

**Exemplo:** `GET /api/v1/clima/Fortaleza`

**Resposta de sucesso (200):**
```json
{
  "nome": "Fortaleza",
  "estado": "CE",
  "coordenadas": { "latitude": -3.7172, "longitude": -38.5434 },
  "clima": {
    "temperatura_min": 24,
    "temperatura_max": 32,
    "condicao": "Parcialmente Nublado",
    "unidades": { "temperatura": "°C" }
  },
  "consultado_em": "2026-06-05T14:30:00.000Z"
}
```

**Erros:** `400` (nome inválido) · `404` (cidade não encontrada) · `503` (serviço externo indisponível)

---

### `GET /api/v1/cidades/{sigla_uf}`
Lista municípios de um estado brasileiro.

**Parâmetros:** `sigla_uf` (2 letras) · `?limite` (1–100, padrão 10)

**Exemplo:** `GET /api/v1/cidades/CE?limite=5`

**Resposta de sucesso (200):**
```json
{
  "uf": "CE",
  "quantidade_retornada": 5,
  "cidades": [
    { "nome": "Abaiara" },
    { "nome": "Acarape" }
  ],
  "consultado_em": "2026-06-05T14:30:00.000Z"
}
```

**Erros:** `400` (sigla inválida) · `404` (UF não encontrada) · `503` (serviço externo indisponível)

## Testes

```bash
npm test
```

Os testes estão em `tests/api.test.js` e cobrem os cenários de sucesso e erro de todos os endpoints.

## Estrutura do projeto

```
/
├── README.md
├── INTEGRANTES.md
├── index.js                        # Entry point
├── package.json
├── src/
│   ├── app.js                      # Configuração do Express
│   ├── routes/
│   │   ├── health.js               # GET /api/v1/health
│   │   ├── clima.js                # GET /api/v1/clima/:nome_cidade
│   │   └── cidades.js              # GET /api/v1/cidades/:sigla_uf
│   └── services/
│       └── apiService.js           # Integração com APIs externas
├── tests/
│   └── api.test.js                 # Testes automatizados (Jest)
└── docs/
    └── postman_collection.json     # Coleção Postman
```
