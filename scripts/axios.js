const api = axios.create({
  baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false',
  timeout: 5000,
  headers: { 'Content-Type': 'Application/json' }
});
