import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [usuarioSalvo, setUsuarioSalvo] = useState(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      const jsonValue = await AsyncStorage.getItem('@usuario');
      if (jsonValue) setUsuarioSalvo(JSON.parse(jsonValue));
    };
    carregarUsuario();
  }, []);

  const handleLogin = () => {
    if (!nome || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (usuarioSalvo && nome === usuarioSalvo.nome && senha === usuarioSalvo.senha) {
      Alert.alert('Login', `Bem-vindo(a) ${usuarioSalvo.nome}!`);
      navigation.navigate('Principal');
    } else {
      Alert.alert('Erro', 'Nome ou senha incorretos');
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Bem-vindo(a)</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Nome</Text>

        <TextInput style={styles.input} value={nome} onChangeText={setNome} 
        placeholder="Digite seu nome..." />

        <Text style={styles.title}>Senha</Text>
        <TextInput style={styles.input} value={senha} onChangeText={setSenha} 
        secureTextEntry placeholder="Digite sua senha..." />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonLogin} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.loginText}>Não possui conta? Cadastre-se</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#38a69d'
  },
  containerHeader: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%'
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff'
  },
  containerForm: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: '5%'
  },
  title: {
    fontSize: 20,
    marginTop: 28
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16
  },
  button: {
     backgroundColor: '#38a69d',
    width: '100%', 
    borderRadius: 4, 
    paddingVertical: 8, 
    marginTop: 14, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  buttonLogin: { 
    marginTop: 14, 
    alignSelf: 'center' 
  },
  loginText: {
    color: '#38a69d', 
    fontSize: 16 
  },
});

