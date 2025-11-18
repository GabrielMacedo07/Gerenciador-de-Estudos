import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import Rotas from './src/rotas'; 


export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#38a69d" barStyle="light-content" />
        <Rotas /> 
      </NavigationContainer>
    </AuthProvider>
  );
}
