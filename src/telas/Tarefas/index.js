import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import CheckBox from "expo-checkbox";
import api from "../servicos/api";

export default function GerenciarTarefas() {

  const [materias, setMaterias] = useState([]); 
  const [selectedMateria, setSelectedMateria] = useState(null);

  const [tema, setTema] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [tarefas, setTarefas] = useState([]);
  const [idEditando, setIdEditando] = useState(null);

  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [loadingTarefas, setLoadingTarefas] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const carregarMaterias = async () => {
    setLoadingMaterias(true);
    try {
      const response = await api.get("/materias");
      setMaterias(response.data || []);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar suas matérias.");
    } finally {
      setLoadingMaterias(false);
    }
  };

  const carregarTarefasDaMateria = async (idMateria) => {
    if (!idMateria) {
      setTarefas([]);
      return;
    }
    setLoadingTarefas(true);
    try {
      const response = await api.get(`/materias/${idMateria}/tarefas`);
      setTarefas(response.data || []);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar as tarefas.");
    } finally {
      setLoadingTarefas(false);
    }
  };

  const handleSalvarTarefa = async () => {
    if (!selectedMateria) {
      Alert.alert("Erro", "Por favor, selecione uma matéria.");
      return;
    }
    if (!tema.trim()) {
      Alert.alert("Erro", "Por favor, preencha o Tema da tarefa.");
      return;
    }

    setLoadingSubmit(true);

    const dadosTarefa = {
      tema: tema,
      descricao: descricao.trim() || null,
      dataEntrega: dataEntrega.trim() || null,
    };

    try {
      if (idEditando) {
        await api.put(`/tarefas/${idEditando}`, dadosTarefa);
        Alert.alert("Sucesso", "Tarefa atualizada!");
      } else {
        await api.post(`/materias/${selectedMateria}/tarefas`, dadosTarefa);
      }

      limparFormulario();
      carregarTarefasDaMateria(selectedMateria);
    } catch (erro) {
      console.log(erro);
      Alert.alert("Erro", "Ocorreu um erro ao salvar a tarefa.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleToggleCheckbox = async (tarefa) => {
    const novoStatus = !tarefa.concluida;
    try {
      await api.patch(`/tarefas/${tarefa.idTarefa}/status`, {
        concluida: novoStatus,
      });
      setTarefas(
        tarefas.map((t) =>
          t.idTarefa === tarefa.idTarefa ? { ...t, concluida: novoStatus } : t
        )
      );
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível atualizar o status da tarefa.");
    }
  };

  const handleDeletarTarefa = (idTarefa) => {
    Alert.alert("Confirmar", "Deseja realmente excluir esta tarefa?", [
      { text: "Cancelar" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/tarefas/${idTarefa}`);
            carregarTarefasDaMateria(selectedMateria);
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir a tarefa.");
          }
        },
      },
    ]);
  };
  const iniciarEdicao = (tarefa) => {
    setIdEditando(tarefa.idTarefa);
    setTema(tarefa.tema);
    setDescricao(tarefa.descricao || "");
    setDataEntrega(tarefa.dataEntrega || "");
  };

  const limparFormulario = () => {
    setIdEditando(null);
    setTema("");
    setDescricao("");
    setDataEntrega("");
  };

  useFocusEffect(
    useCallback(() => {
      carregarMaterias();
      return () => {
        limparFormulario();
        setTarefas([]);
        setSelectedMateria(null);
      };
    }, [])
  );

  const renderHeader = () => (
    <View>
      {/* --- Formulário --- */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {idEditando ? "Editando Tarefa" : "Adicionar Nova Tarefa"}
        </Text>

        <Text style={styles.label}>Matéria</Text>
        {loadingMaterias ? <ActivityIndicator /> : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMateria}
              onValueChange={(itemValue) => {
                setSelectedMateria(itemValue);
                carregarTarefasDaMateria(itemValue);
                limparFormulario();
              }}
              style={styles.picker}
              enabled={!idEditando}
            >
              <Picker.Item label="-- Escolha uma matéria --" value={null} />
              {materias.map((materia) => (
                <Picker.Item key={materia.idMateria} label={materia.nomeMateria} value={materia.idMateria} />
              ))}
            </Picker>
          </View>
        )}
        <Text style={styles.label}>Tema da Tarefa</Text>
            <TextInput style={styles.input} placeholder="Ex: Lista de Exercícios 1" value={tema} onChangeText={setTema} />

        <Text style={styles.label}>Descrição (Opcional)</Text>
        <TextInput style={styles.input} placeholder="Ex: Fazer exercícios 1 a 5" value={descricao} onChangeText={setDescricao} />
        <Text style={styles.label}>Data de Entrega (Opcional)</Text>
        <TextInput style={styles.input} placeholder="Ex: AAAA-MM-DD" value={dataEntrega} onChangeText={setDataEntrega} />
        <Button
          title={loadingSubmit ? "Salvando..." : (idEditando ? "Atualizar Tarefa" : "Salvar Tarefa")}
          color="#38a69d" 
          onPress={handleSalvarTarefa} 
          disabled={loadingSubmit}
        />
        {idEditando && (
          <TouchableOpacity style={styles.cancelButton} onPress={limparFormulario}>
            <Text style={styles.cancelText}>Cancelar Edição</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.listTitle}>Tarefas Cadastradas</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.item} key={item.idTarefa.toString()}>
      <View style={[styles.itemTextContainer, { textDecorationLine: item.concluida ? 'line-through' : 'none' }]}>
        <Text style={[styles.itemMateria, item.concluida && styles.textConcluido]}>{item.tema}</Text> 
        {item.descricao && <Text style={[styles.itemTema, item.concluida && styles.textConcluido]}>{item.descricao}</Text>}
        {item.dataEntrega && <Text style={[styles.itemData, item.concluida && styles.textConcluido]}>{item.dataEntrega}</Text>}
      </View>
      <View style={styles.itemButtons}>
        <TouchableOpacity 
          onPress={() => handleToggleCheckbox(item)}
          style={styles.actionButton}
        >
          <Feather 
            name={item.concluida ? "check-circle" : "circle"} 
            size={22} 
            color={item.concluida ? "#28a745" : "#6c757d"} 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => iniciarEdicao(item)} style={styles.actionButton}>
          <Feather name="edit-2" size={20} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletarTarefa(item.idTarefa)} style={styles.actionButton}>
          <Feather name="trash-2" size={20} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={tarefas}
      keyExtractor={item => item.idTarefa.toString()}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader} 
      ListEmptyComponent={() => (
        !loadingTarefas ? 
        <Text style={styles.emptyText}>Nenhuma tarefa cadastrada para esta matéria.</Text> 
        : null
      )}
      ListFooterComponent={() => (
        loadingTarefas ? <ActivityIndicator size="large" color="#38a69d" style={{ margin: 20 }} /> : null
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollContainer: {
    padding: 50,
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
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginLeft: 5,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#fff',
  },
  picker: {
    width: "100%",
    height: 50,
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
    marginRight: 10,
  },
  itemMateria: { 
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemTema: { 
    fontSize: 14,
    color: '#666',
  },
  itemData: { 
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  textConcluido: {
    color: '#999',
    opacity: 0.6,
  },
  itemButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  }
});