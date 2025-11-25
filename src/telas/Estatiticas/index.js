import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  ActivityIndicator,
  Button
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import api from '../servicos/api'; 

export default function Estatisticas() {
  
  const [materias, setMaterias] = useState([]); 
  const [selectedMateria, setSelectedMateria] = useState(null); 
  const [descricao, setDescricao] = useState('');
  const [nota, setNota] = useState('');
  const [notaLista, setNotaLista] = useState([]); 
  const [idEditando, setIdEditando] = useState(null); 

  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [loadingNotas, setLoadingNotas] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const carregarMaterias = async () => {
    setLoadingMaterias(true);
    try {
      const response = await api.get('/materias');
      setMaterias(response.data || []);
    } catch (e) {
      console.error("Erro ao carregar matérias: ", e);
      Alert.alert("Erro", "Não foi possível carregar suas matérias.");
    } finally {
      setLoadingMaterias(false);
    }
  };

  const carregarNotasDaMateria = async (idMateria) => {
    if (!idMateria) {
      setNotaLista([]);
      return;
    }
    setLoadingNotas(true);
    try {
      const response = await api.get(`/materias/${idMateria}/notas`);
      setNotaLista(response.data || []);
    } catch (e) {
      console.error("Erro ao carregar notas: ", e);
    } finally {
      setLoadingNotas(false);
    }
  };

  const salvarNotas = async () => {
    if (!selectedMateria) {
        Alert.alert('Erro', 'Por favor, selecione uma matéria.');
        return;
    }
    if (!descricao.trim() || !nota.trim()) {
      Alert.alert('Erro', 'Por favor, preencha a descrição e a nota.');
      return;
    }
    const notaNumero = parseFloat(nota.replace(',', '.'));
    if (isNaN(notaNumero) || notaNumero < 0 || notaNumero > 10) {
      Alert.alert('Erro', 'A nota deve ser um número entre 0 e 10.');
      return;
    }

    setLoadingSubmit(true);

    const dadosNota = {
      descricao: descricao,
      nota: notaNumero
    };

    try {
      if (idEditando) {
        await api.put(`/notas/${idEditando}`, dadosNota);
        Alert.alert('Sucesso', 'Nota atualizada com sucesso!');
      } else {
        await api.post(`/materias/${selectedMateria}/notas`, dadosNota);
        Alert.alert('Sucesso', 'Nota salva com sucesso!');
      }
      
      limparFormulario();
      carregarNotasDaMateria(selectedMateria); 

    } catch (erro) {
      console.log(erro);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a nota.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeletarNota = (idNota) => {
    Alert.alert("Confirmar", "Deseja realmente excluir esta nota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/notas/${idNota}`);
            Alert.alert("Sucesso", "Nota excluída.");
            carregarNotasDaMateria(selectedMateria); 
          } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível excluir a nota.");
          }
        },
      },
    ]);
  };
  
  const iniciarEdicao = (item) => {
    setIdEditando(item.idNota);
    setDescricao(item.descricao);
    setNota(item.nota.toString()); 
  };

  const limparFormulario = () => {
    setIdEditando(null);
    setDescricao('');
    setNota('');
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true; // Flag

      const carregarMaterias = async () => {
        if (isActive) setLoadingMaterias(true);
        try {
          const response = await api.get('/materias');
          if (isActive) {
            setMaterias(response.data || []);
          }
        } catch (e) {
          if (isActive) Alert.alert("Erro", "Não foi possível carregar matérias.");
        } finally {
          if (isActive) setLoadingMaterias(false);
        }
      };

      carregarMaterias();

      return () => {
        isActive = false; // Cleanup
        // Limpa estados ao sair
        limparFormulario();
        setNotaLista([]);
        setSelectedMateria(null);
      };
    }, [])
  );

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContentContainer}
    >
      <Text style={styles.titulo}>Gerencie suas notas</Text>

      {/* --- Formulário de Adição/Edição de Notas --- */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Matéria</Text>
        {loadingMaterias ? <ActivityIndicator /> : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMateria}
              onValueChange={(itemValue) => {
                setSelectedMateria(itemValue);
                carregarNotasDaMateria(itemValue);
              }}
              style={styles.picker}
            >
              <Picker.Item label="-- Escolha uma matéria --" value={null} />
              {materias.map((materia) => (
                <Picker.Item key={materia.idMateria} label={materia.nomeMateria} value={materia.idMateria} />
              ))}
            </Picker>
          </View>
        )}

        <Text style={styles.label}>Descrição (Ex: Período 1, Trabalho Final)</Text>
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />

        <Text style={styles.label}>Nota (0 a 10)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nota"
          keyboardType="numeric"
          value={nota}
          onChangeText={setNota}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={salvarNotas} 
          disabled={loadingSubmit}
        >
          <Text style={styles.buttonText}>
            {loadingSubmit ? "Salvando..." : (idEditando ? "Atualizar Nota" : "Salvar Nota")}
          </Text>
        </TouchableOpacity>

        {/* Botão de Cancelar Edição */}
        {idEditando && (
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={limparFormulario}
          >
            <Text style={styles.buttonText}>Cancelar Edição</Text>
          </TouchableOpacity>
        )}
      </View>

      {}
      <Text style={[styles.titulo, { marginTop: 20 }]}>Notas Cadastradas</Text>

      {loadingNotas && <ActivityIndicator size="large" color="#38a69d" />}

      {!loadingNotas && notaLista.length === 0 && (
        <Text style={styles.emptyText}>Nenhuma nota cadastrada para esta matéria.</Text>
      )}

      {!loadingNotas && notaLista.length > 0 && (
        <View style={styles.listContainer}>
          {notaLista.map((item) => (
            <View style={styles.item} key={item.idNota.toString()}>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemDescricao}>{item.descricao}</Text>
                <Text style={styles.itemNota}>Nota: {item.nota}</Text>
              </View>
              <View style={styles.itemButtons}>
                <TouchableOpacity onPress={() => iniciarEdicao(item)}>
                  <Feather name="edit-2" size={20} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletarNota(item.idNota)}>
                  <Feather name="trash-2" size={20} color="#dc3545" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  scrollContentContainer: {
    padding: 20, 
    alignItems: "center",
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 20,
    color: "#38a69d",
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 10,
    width: '100%',
  },
  picker: {
    width: "100%",
    height: 50,
  },
  button: {
    backgroundColor: "#38a69d",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ff4d4d', 
    marginTop: 10
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  listContainer: {
    width: '100%',
  },
  item: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1, 
    borderColor: "#eee" 
  },
  itemTextContainer: {
    flex: 1,
  },
  itemDescricao: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemNota: {
    fontSize: 16,
  },
  itemButtons: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
  },
});