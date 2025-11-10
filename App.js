import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';

// 1. Importe o AuthProvider que criamos
import { AuthProvider } from './src/contexts/AuthContext';

// 2. Importe seu arquivo de rotas
import Rotas from './src/rotas'; // Assumindo que o arquivo é 'src/rotas/index.js'

export default function App() {
  return (
    // 3. Envolva o NavigationContainer com o AuthProvider
    <AuthProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#38a69d" barStyle="light-content" />
        <Rotas /> 
      </NavigationContainer>
    </AuthProvider>
  );
}
