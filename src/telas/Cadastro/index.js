import React, { useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cadastro() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');



  const handleRegister = async () => {
   if (!nome || !curso || !periodo || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;    
  }
    
    try {
    const usuario = { nome, curso, periodo, email, senha };
    await AsyncStorage.setItem('@usuario', JSON.stringify(usuario));
    Alert.alert('Cadastro', 'Usuário cadastrado com sucesso!');
    navigation.navigate('Login');
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível salvar os dados.');
    console.log(error);
  }
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
          value={nome}
          onChangeText={setNome}
        />

         <Text style={styles.title}>Curso</Text>
        <TextInput 
          placeholder="Digite seu Curso..."
          style={styles.input}
          value={curso}
          onChangeText={setCurso}
        />

        <Text style={styles.title}>Periodo</Text>
        <TextInput 
          placeholder="Digite seu Periodo..."
          style={styles.input}
          value={periodo}
          onChangeText={setPeriodo}
        />

        <Text style={styles.title}>Email</Text>
        <TextInput 
          placeholder="Digite seu email..."
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.title}>Senha</Text>
        <TextInput 
          placeholder="Digite sua senha..."
          style={styles.input}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.title}>Confirmar Senha</Text>
        <TextInput 
          placeholder="Confirme sua senha..."
          style={styles.input}
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}  
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
    marginTop: '5%',
    marginBottom: '8%',
    paddingStart: '5%',
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  containerForm: {
    flex: 5,
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
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonLogin: {
    marginTop: 10,
    alignSelf: 'center',
  },
  loginText: {
    color: '#38a69d',
    fontSize: 16,
  },
});
