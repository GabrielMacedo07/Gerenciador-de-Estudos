import React, { useState, useCallback } from 'react';
// 1. Imports necessários
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import api from '../servicos/api';
import { useAuth } from '../../contexts/AuthContext';

export default function Formulario() {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth(); 
  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [idade, setIdade] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        setNome(user.nome || '');
        setCurso(user.curso || '');
        setPeriodo(user.periodoAtual || '');
        setIdade(user.idade ? user.idade.toString() : '');
      }
    }, [user])
  );

  const handleSave = async () => {
    if (!nome.trim() || !curso.trim() || !periodo.trim() || !idade.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    const dadosFormulario = {
      nome: nome,
      curso: curso,
      periodoAtual: periodo,
      idade: parseInt(idade)
    };

    try {
      const response = await api.patch('/usuarios/completar-perfil', dadosFormulario);
      const usuarioAtualizado = response.data;

      await updateUser(usuarioAtualizado);
      Alert.alert('Sucesso!', 'Seu perfil foi atualizado.');
     

    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      Alert.alert('Erro', 'Não foi possível salvar seu perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
          {/* 11. Título dinâmico */}
          <Text style={styles.message}>
            {user?.curso ? 'Atualize seus Dados' : 'Complete seu Perfil'}
          </Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.containerForm}>

          <Text style={styles.title}>Nome</Text>
          <TextInput
            placeholder="Digite seu nome completo..."
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.title}>Curso</Text>
          <TextInput
            placeholder="Digite seu curso..."
            style={styles.input}
            value={curso}
            onChangeText={setCurso}
          />

          <Text style={styles.title}>Período</Text>
          <TextInput
            placeholder="Ex: 5º Período"
            style={styles.input}
            value={periodo}
            onChangeText={setPeriodo}
          />

          <Text style={styles.title}>Idade</Text>
          <TextInput
            placeholder="Digite sua idade..."
            style={styles.input}
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
          />

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSave} 
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Salvando...' : 'Salvar Perfil'}
            </Text>
          </TouchableOpacity>

        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#38a69d' },
  scrollViewContent: { flexGrow: 1 },
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
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: '5%',
    paddingVertical: '5%'
  },
  title: {
    fontSize: 20,
    marginTop: 20,
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
    marginTop: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});