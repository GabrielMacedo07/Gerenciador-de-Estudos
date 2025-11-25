import React, { createContext, useState, useContext, useEffect } from 'react'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../telas/servicos/api';

const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- INTERCEPTOR DE TOKEN EXPIRADO (401) ---
    // Isso garante que se o backend recusar o token, o app desloga sozinho
    const interceptorId = api.interceptors.response.use(
      (response) => response, // Se sucesso, passa direto
      async (error) => {
        if (error.response && error.response.status === 403) {
           // O Spring Security retorna 403 Forbidden quando o token JWT é inválido/expirado
           // (Às vezes 401, mas no seu filtro configuramos exceções que podem virar 403)
           console.log("Sessão expirada. Fazendo logout...");
           await logout();
        }
        return Promise.reject(error);
      }
    );

    // Carrega dados iniciais
    async function loadStorageData() {
      try {
        const storedToken = await AsyncStorage.getItem('@token');
        const storedUser = await AsyncStorage.getItem('@user');

        if (storedToken && storedUser) {
          // --- PARSE SEGURO DO JSON ---
          // Evita crash se o dado estiver corrompido
          try {
             const parsedUser = JSON.parse(storedUser);
             api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
             setToken(storedToken);
             setUser(parsedUser);
          } catch (jsonError) {
             console.error("Erro ao ler usuário salvo (JSON inválido). Limpando...", jsonError);
             await logout(); // Dados corrompidos? Limpa tudo.
          }
        }
      } catch (e) {
        console.error("Erro ao carregar AsyncStorage", e);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();

    // Cleanup do interceptor quando o provider desmontar
    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, []);

  const login = async (email, senha) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', {
        email: email,
        senha: senha
      });

      // Backend agora retorna { token, usuario }
      const { token, usuario } = response.data; 

      // Salva estados
      setToken(token);
      setUser(usuario);

      // Salva persistência
      await AsyncStorage.setItem('@token', token);
      await AsyncStorage.setItem('@user', JSON.stringify(usuario));

      // Configura Axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setLoading(false);
      return usuario; // Retorna o usuário para decisão de rota (Formulario vs Home)

    } catch (error) {
      console.log("Erro no login:", error);
      setLoading(false);
      throw new Error('Email ou senha inválidos.');
    }
  };

  const logout = async () => {
    // Não ativamos setLoading(true) aqui para evitar flash de tela branca
    // apenas limpamos os dados
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization']; // Remove do header
    await AsyncStorage.clear();
  };

  // Função para atualizar dados do usuário (usada no Formulario)
  const updateUser = (newUserData) => {
    setUser(newUserData);
    AsyncStorage.setItem('@user', JSON.stringify(newUserData)).catch(err => console.log(err));
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn: !!token,
      user, 
      token, 
      loading, 
      login, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }
  return context;
}

export { AuthProvider, useAuth };