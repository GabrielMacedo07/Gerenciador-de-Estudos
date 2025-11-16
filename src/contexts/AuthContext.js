import React, { createContext, useState, useContext, useEffect } from 'react'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../telas/servicos/api';

const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await AsyncStorage.getItem('@token');
        const storedUser = await AsyncStorage.getItem('@user');

        if (storedToken && storedUser) {
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Erro ao carregar dados do AsyncStorage", e);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);
  const login = async (email, senha) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', {
        email: email,
        senha: senha
      });

      const { token, usuario } = response.data; 

      setToken(token);
      setUser(usuario);

      await AsyncStorage.setItem('@token', token);
      await AsyncStorage.setItem('@user', JSON.stringify(usuario)); 

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setLoading(false);
      return usuario;

    } catch (error) {
      console.log("Erro no login (AuthContext):", error);
      setLoading(false);
      throw new Error('Email ou senha inválidos.');
    }
  };
  const updateUser = (newUserData) => {
      setUser(newUserData);
      AsyncStorage.setItem('@user', JSON.stringify(newUserData));
    };

  const logout = async () => {
    setLoading(true);
    setToken(null);
    setUser(null);
    await AsyncStorage.clear();
    api.defaults.headers.common['Authorization'] = '';
    setLoading(false);
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