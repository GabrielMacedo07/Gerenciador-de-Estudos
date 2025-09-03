import React from 'react';
import { View, Platform, StatusBar as RNStatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Rotas from './src/rotas';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <NavigationContainer>
      {/* StatusBar do Expo apenas para o estilo do texto */}
      <StatusBar style="dark" />

      {/* View para cor de fundo da StatusBar */}
      {Platform.OS === 'android' && (
        <View style={{
          height: RNStatusBar.currentHeight,
          backgroundColor: '#ffffffff'
        }} />
      )}
 
      <Rotas />
    </NavigationContainer>
  );
}
