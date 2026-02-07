import axios from 'axios';

const api = axios.create({
  // ATENÇÃO: Caso a porta da API mude durante a execução, altere o número abaixo:
  baseURL: 'https://localhost:7012/api', 
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'CG-7da91672-870b-4691-881e-6604213da202'
  }
});

export default api;