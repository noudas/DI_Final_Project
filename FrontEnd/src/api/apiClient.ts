import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://di-final-project-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona o token ao header de cada requisição
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Para React Web
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com erros globais
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Exemplo: Se o token for inválido ou expirado
      if (error.response.status === 401) {
        console.error('Erro 401: Token inválido ou expirado');
        localStorage.removeItem('authToken'); // Para React Web
        window.location.href = '/login'; // Redireciona para login
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
