// src/telas/Sair.js
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Sair() {
  const navigation = useNavigation();

  useEffect(() => {
    const logout = async () => {
      // Apaga dados do usuário (opcional)
      await AsyncStorage.removeItem('@usuario');
      await AsyncStorage.removeItem('@imagem_perfil');

      // Redefine a pilha e volta para Welcome
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    };

    logout();
  }, []);

  return null; // não exibe nada na tela
}
