#!/usr/bin/env node

const express = require('express');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
  .option('-r, --routes <path>', 'Caminho do arquivo JSON de rotas')
  .option('-p, --port <port>', 'Porta do servidor', '9000')
  .parse(process.argv);

const app = express();
const port = Number(program.opts().port);

app.use(express.json());

// Função para carregar configurações do arquivo JSON
const loadRoutes = () => {
  const filePath = path.join(process.cwd(), 'routes.json');
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Erro ao carregar configurações:', error.message);
    return {};
  }
};

// Função para manipular a requisição
const handleRequest = (req, res, params, body, headers, response) => {
  // Verifica se os parâmetros da requisição correspondem aos definidos no arquivo JSON
  for (const [paramKey, paramValue] of Object.entries(params)) {
    if (req.params[paramKey] !== paramValue) {
      return res.status(400).json({ error: `Valor incorreto para o parâmetro ${paramKey}` });
    }
  }

  // Verifica se o corpo da requisição corresponde ao definido no arquivo JSON
  if (Object.keys(body).length > 0 && !isEqual(req.body, body)) {
    return res.status(400).json({ error: 'Corpo da requisição incorreto' });
  }

  // Verifica se os headers da requisição correspondem aos definidos no arquivo JSON
  for (const [headerKey, headerValue] of Object.entries(headers)) {
    if (req.get(headerKey) !== headerValue) {
      return res.status(400).json({ error: `Valor incorreto para o header ${headerKey}` });
    }
  }

  res.json(response);
};

// Função para configurar os endpoints com base no arquivo JSON
const configureMockEndpoints = () => {
  const mockConfig = loadRoutes();

  for (const [route, config] of Object.entries(mockConfig)) {
    const { method = 'GET', response = {}, headers = {}, body = {}, params = {} } = config;

    switch (method.toUpperCase()) {
      case 'GET':
        app.get(route, (req, res) => handleRequest(req, res, params, body, headers, response));
        break;
      case 'POST':
        app.post(route, (req, res) => handleRequest(req, res, params, body, headers, response));
        break;
      case 'PUT':
        app.put(route, (req, res) => handleRequest(req, res, params, body, headers, response));
        break;
      case 'PATCH':
        app.patch(route, (req, res) => handleRequest(req, res, params, body, headers, response));
        break;
      case 'DELETE':
        app.delete(route, (req, res) => handleRequest(req, res, params, body, headers, response));
        break;
      default:
        console.warn(`Método não suportado para a rota ${route}`);
    }
  }
};

// Função para verificar se dois objetos são iguais
const isEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

// Configura os endpoints
configureMockEndpoints();

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor mock rodando em http://localhost:${port}`);
});
