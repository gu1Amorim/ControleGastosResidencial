import axios from 'axios';

/**
 * Configuração centralizada do Axios para consumo da WebAPI.
 * X-Api-Key: Adicionada ao header para garantir a segurança dos endpoints.
 * baseURL: Deve ser ajustada caso a porta da API mude no ambiente de teste.
 */
const api = axios.create({
  // ATENÇÃO: Caso a porta da API mude durante a execução, altere o número abaixo:
  baseURL: 'https://localhost:7012/api', 
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'CG-7da91672-870b-4691-881e-6604213da202'
  }
});

export default api;