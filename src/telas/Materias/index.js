import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ScrollView, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import api from '../servicos/api'; 

export default function Materias() {
  

  const [nomeMateria, setNomeMateria] = useState("");
  const [tema, setTema] = useState("");
  const [materias, setMaterias] = useState([]); 
  const [idEditando, setIdEditando] = useState(null); 
  const [loadingLista, setLoadingLista] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const carregarMaterias = async () => {
    setLoadingLista(true);
    try {
      const response = await api.get('/materias');
      setMaterias(response.data || []);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar suas matérias.");
      console.log(error);      
    } finally {
      setLoadingLista(false);
    }
  };

  const handleSalvarMateria = async () => {
    if (!nomeMateria.trim() || !tema.trim()) {
      Alert.alert("Erro", "Preencha o nome da matéria e o tema.");
      return;
    }
    setLoadingSubmit(true);

    const dadosMateria = {
      nomeMateria: nomeMateria,
      tema: tema
    };

    try {
      if (idEditando) {
        await api.put(`/materias/${idEditando}`, dadosMateria);
        Alert.alert("Sucesso!", "Matéria atualizada.");
      } else {
        await api.post('/materias', dadosMateria);
        Alert.alert("Sucesso!", "Matéria cadastrada.");
      }
      
      limparFormulario();
      carregarMaterias(); 

    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      Alert.alert("Erro", "Não foi possível salvar a matéria.");
    } finally {
      setLoadingSubmit(false);
    }
  };


  const handleDeletarMateria = async (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta matéria?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/materias/${id}`);
              Alert.alert("Sucesso!", "Matéria excluída.");
              carregarMaterias(); 
            } catch (error) {
              console.log(error);
              Alert.alert("Erro", "Não foi possível excluir a matéria.");
            }
          }
        }
      ]
    );
  };


  const iniciarEdicao = (materia) => {
    setIdEditando(materia.idMateria);
    setNomeMateria(materia.nomeMateria);
    setTema(materia.tema);
  };

  const limparFormulario = () => {
    setIdEditando(null);
    setNomeMateria("");
    setTema("");
  };

  useFocusEffect(
    useCallback(() => {
      carregarMaterias();
    }, [])
  );


  return (

    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContainer}
    >
      {/* Formulário de Criação/Edição */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {idEditando ? "Editando Matéria" : "Adicionar Nova Matéria"}
        </Text>

        <TextInput 
          placeholder="Nome da Matéria" 
          value={nomeMateria} 
          onChangeText={setNomeMateria} 
          style={styles.input}
        />
        
        <TextInput 
          placeholder="Tema Principal" 
          value={tema} 
          onChangeText={setTema} 
          style={styles.input}
        />
        
        <Button 
          title={loadingSubmit ? "Salvando..." : (idEditando ? "Atualizar Matéria" : "Adicionar Matéria")}
          color="#38a69d" 
          onPress={handleSalvarMateria} 
          disabled={loadingSubmit}
        />
        
        {idEditando && (
          <TouchableOpacity style={styles.cancelButton} onPress={limparFormulario}>
            <Text style={styles.cancelText}>Cancelar Edição</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Título da Lista */}
      <Text style={styles.listTitle}>Matérias Cadastradas</Text>

      {/* Lista de Materias */}
      {loadingLista ? (
        <ActivityIndicator size="large" color="#38a69d" style={{ marginTop: 20 }} />
      ) : (
        materias.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma matéria cadastrada ainda.</Text>
        ) : (
          <View>
            {materias.map((item) => (
              <View style={styles.item} key={item.idMateria.toString()}>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemMateria}>{item.nomeMateria}</Text>
                  <Text style={styles.itemTema}>{item.tema}</Text>
                </View>
                <View style={styles.itemButtons}>
                  <TouchableOpacity onPress={() => iniciarEdicao(item)}>
                    <Feather name="edit-2" size={20} color="#007bff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeletarMateria(item.idMateria)}>
                    <Feather name="trash-2" size={20} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollContainer: {
    paddingBottom: 50, 
  },

  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
    marginTop: 40, 
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#007bff',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 25,
    marginBottom: 10,
    marginLeft: 15,
  },
  item: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1, 
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemMateria: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemTema: {
    fontSize: 14,
    color: '#666',
  },
  itemButtons: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  }
});