import React, { useState} from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView , KeyboardAvoidingView , Platform } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native'; 
import api from '../servicos/api';

export default function Cadastro() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);


  const handleRegister = async () => {
   if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;    
  }

  const dadosUsuario = {
        nome: nome,
        email: email,
        senha: senha
    };
    
    try {

    await api.post('/usuarios', dadosUsuario);
    Alert.alert('Cadastro', 'Usuário cadastrado com sucesso!');
    navigation.navigate('Login');
    
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
      if (error.response) {
        Alert.alert('Erro no cadastro', 'Verifique os dados. O email pode já estar em uso.');
      } else {
        Alert.alert('Erro de Conexão', 'Não foi possível se conectar ao servidor.');
      }
  } finally {
    setLoading(false);
  }
};

    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView  contentContainerStyle={styles.scrollViewContent}>
        <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
          <Text style={styles.message}>Crie sua conta</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <Text style={styles.title}>Nome</Text>
          <TextInput 
            placeholder="Digite seu nome..."
            style={styles.input}
            value={nome}
            onChangeText={setNome}
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
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRegister} 
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.buttonLogin}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>Já possui conta? Faça login</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollViewContent: {
    flexGrow: 1,
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
