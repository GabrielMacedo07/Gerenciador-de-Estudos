import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

export default function Cadastro() {
  const navigation = useNavigation();

  const handleRegister = () => {
    Alert.alert('Cadastro', 'Usuário cadastrado com sucesso!');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Crie sua conta</Text>
      </Animatable.View>

      {/* Formulário */}
      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Nome</Text>
        <TextInput 
          placeholder="Digite seu nome..."
          style={styles.input}
        />

        <Text style={styles.title}>Email</Text>
        <TextInput 
          placeholder="Digite seu email..."
          style={styles.input}
          keyboardType="email-address"
        />

        <Text style={styles.title}>Senha</Text>
        <TextInput 
          placeholder="Digite sua senha..."
          style={styles.input}
          secureTextEntry
        />

        <Text style={styles.title}>Confirmar Senha</Text>
        <TextInput 
          placeholder="Confirme sua senha..."
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonLogin}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Já possui conta? Faça login</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#38a69d',
  },
  containerHeader: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  containerForm: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: '5%',
  },
  title: {
    fontSize: 20,
    marginTop: 20,
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 40,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#38a69d',
    width: '100%',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonLogin: {
    marginTop: 15,
    alignSelf: 'center',
  },
  loginText: {
    color: '#38a69d',
    fontSize: 16,
  },
});
