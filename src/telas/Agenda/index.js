import React, { useState, useCallback } from "react";
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import api from '../servicos/api';
export default function Agenda({ navigation }) {
  
  const [materias, setMaterias] = useState([]); 
  const [selectedMateria, setSelectedMateria] = useState(null); 
  const [hora, setHora] = useState("");
  const [sala, setSala] = useState("");
  const [bloco, setBloco] = useState("");
  const [eventos, setEventos] = useState([]); 
  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

    useFocusEffect(useCallback(() => {
      let isActive = true; // Flag

      const carregarMaterias = async () => {
        if (isActive) setLoadingMaterias(true);
        try {
          const response = await api.get('/materias');
          if (isActive) {
            setMaterias(response.data || []);
          }
        } catch (error) {
          if (isActive) Alert.alert("Erro", "Não foi possível carregar matérias.");
        } finally {
          if (isActive) setLoadingMaterias(false);
        }
      };

      carregarMaterias();

      return () => {
        isActive = false; // Cleanup
        // Opcional: Limpar estados ao sair
        setEventos([]);
        setSelectedMateria(null);
      };
    }, []));


  // const carregarMaterias = async () => {
  //   setLoadingMaterias(true);
  //   try {
  //     const response = await api.get('/materias');
  //     setMaterias(response.data || []);
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert("Erro", "Não foi possível carregar suas matérias.");
  //   } finally {
  //     setLoadingMaterias(false);
  //   }
  // };

  const carregarEventos = async (idMateria) => {
    if (!idMateria) {
      setEventos([]);
      return;
    }
    setLoadingEventos(true);
    try {
      const response = await api.get(`/materias/${idMateria}/eventos`);
      setEventos(response.data || []);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os eventos desta matéria.");
      console.log(error);
    } finally {
      setLoadingEventos(false);
    }
  };

  const adicionarAtividade = async () => {
    if (!selectedMateria) {
      Alert.alert("Erro", "Por favor, selecione uma matéria primeiro.");
      return;
    }
    setLoadingSubmit(true);

    const dadosEvento = {
      hora: hora.trim() || null, 
      sala: sala.trim() || null,
      bloco: bloco.trim() || null,
    };

    try {
      await api.post(`/materias/${selectedMateria}/eventos`, dadosEvento);
      
      setHora("");
      setSala("");
      setBloco("");
      carregarEventos(selectedMateria); 

    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      Alert.alert("Erro", "Não foi possível salvar o evento.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const excluirAtividade = async (idEvento) => {
    try {
      await api.delete(`/eventos/${idEvento}`);
      Alert.alert("Sucesso", "Evento excluído.");
      carregarEventos(selectedMateria);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível excluir o evento.");
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContentContainer}
    > 
      <View style={styles.header}>
        <Text style={styles.Adicionar}>Organize seus horarios de estudos</Text>
      </View>

      {}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Selecione a Matéria:</Text>
        {loadingMaterias ? <ActivityIndicator /> : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMateria}
              onValueChange={(itemValue) => {
                setSelectedMateria(itemValue);
                carregarEventos(itemValue);
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

        {}
        <Text style={styles.label}>Hora (Opcional - Formato HH:MM)</Text>
        <TextInput 
          placeholder="Ex: 19:30" 
          value={hora} 
          onChangeText={setHora} 
          style={styles.input}
        />
        <Text style={styles.label}>Sala (Opcional)</Text>
        <TextInput 
          placeholder="Ex: 104" 
          value={sala} 
          onChangeText={setSala} 
          style={styles.input}
        />
        <Text style={styles.label}>Bloco (Opcional)</Text>
        <TextInput 
          placeholder="Ex: C" 
          value={bloco} 
          onChangeText={setBloco} 
          style={styles.input}
        />
        <Button 
          title={loadingSubmit ? "Adicionando..." : "Adicionar Evento"}
          color="#38a69d" 
          onPress={adicionarAtividade} 
          disabled={loadingSubmit}
        />
      </View>

      {}
      <Text style={styles.listTitle}>Eventos Salvos para esta Matéria</Text>
      {loadingEventos && <ActivityIndicator style={{marginTop: 20}} />}
      
      {!loadingEventos && eventos.length === 0 && (
         <Text style={styles.emptyText}>Nenhum evento cadastrado para esta matéria.</Text>
      )}

      {}
      {!loadingEventos && eventos.length > 0 && (
        <View style={styles.listContainer}>
          {eventos.map((item) => (
            <View style={styles.item} key={item.idEvento.toString()}>
              <View style={styles.itemText}>
                {item.hora && <Text>Horário: {item.hora}</Text>}
                {item.sala && <Text>Sala: {item.sala}</Text>}
                {item.bloco && <Text>Bloco: {item.bloco}</Text>}
                {!item.hora && !item.sala && !item.bloco && <Text>Evento/Lembrete</Text>}
              </View>
              <TouchableOpacity onPress={() => excluirAtividade(item.idEvento)}>
                <Feather name="trash-2" size={20} color="#dc3545" />
              </TouchableOpacity>
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
    backgroundColor: "#fff", 
  },

  scrollContentContainer: {
    alignItems: "center", 
    justifyContent: "flex-start",
    paddingBottom: 75,
  },
  header: { 
    backgroundColor: "#fff", 
    paddingVertical: 40, 
    width: "100%", 
    alignItems: "center", 
    justifyContent: "center",
    marginBottom: 20,
  },
  Adicionar: { 
    fontSize: 25, 
    fontWeight: "bold", 
    color: "#38a69d", 
  },
  formContainer: {
    width: '90%', 
    alignItems: 'stretch',
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
    marginBottom: 15,
    borderRadius: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    marginBottom: 15,
    width: "100%",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30,
    marginBottom: 10,
    width: '90%',
  },
  listContainer: {
    width: '90%',
  },
  item: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1, 
    borderColor: "#eee" 
  },
  itemText: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
  },
});