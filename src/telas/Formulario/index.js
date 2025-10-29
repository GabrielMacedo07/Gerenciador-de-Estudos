import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import api from '../servicos/api';

export default function Formulario() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [idade, setIdade] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    if (!curso || !periodo || !idade) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);

    const dadosFormulario = {
      curso: curso,
      periodoAtual: periodo, // Lembre-se que no backend é 'periodoAtual'
      idade: parseInt(idade)
    };

    try {
      // 4. Chame o novo endpoint PATCH
      // A autenticação (token) já é enviada automaticamente
      // pois configuramos o 'api' no login.
      await api.patch('/usuarios/completar-perfil', dadosFormulario);

      Alert.alert('Sucesso!', 'Seu perfil foi completado.');
      
      // 5. Navegue para a tela principal
      navigation.navigate('Principal');

    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      Alert.alert('Erro', 'Não foi possível salvar seu perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeInDown" delay={300} style={styles.header}>
        <Text style={styles.headerText}>Complete seu cadastro</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.form}>
        <TextInput placeholder="Nome completo" style={styles.input} value={nome} onChangeText={setNome} />
        <TextInput placeholder="Curso" style={styles.input} value={curso} onChangeText={setCurso} />
        <TextInput placeholder="Período" style={styles.input} value={periodo} onChangeText={setPeriodo} />
        <TextInput placeholder="Idade" style={styles.input} value={idade} onChangeText={setIdade} keyboardType="numeric" />

        <TouchableOpacity style={styles.button} onPress={handleEnviar}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#38a69d' 
  },
  header: {
     marginTop: '10%', 
     padding: 20 },
  headerText: { 
    color: '#fff', 
    fontSize: 26, 
    fontWeight: 'bold' 
  },
  form: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25, 
    padding: 20 
  },
  input: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc', 
    marginBottom: 20, 
    fontSize: 18 },
  button: { 
    backgroundColor: '#38a69d', 
    borderRadius: 10, 
    padding: 12, 
    alignItems: 'center', 
    marginTop: 10 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
