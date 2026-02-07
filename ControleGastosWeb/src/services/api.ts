import axios from 'axios';

const api = axios.create({
  // URL da sua API C# (confira a porta no seu Visual Studio!)
  baseURL: 'https://localhost:7012/api', 
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'CG-7da91672-870b-4691-881e-6604213da202'
  }
});

export default api;