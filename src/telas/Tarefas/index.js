import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";

export default function Tarefas({ navigation }) {
  const [Materia, setMateria] = useState("");
  const [Pagina, setPagina] = useState("");
  const [Data, setData] = useState("");
  const [listaDeTarefas, setListaDeTarefas] = useState([]);

  const adicionarTarefa = () => {
    if (!Materia.trim() || !Pagina.trim() || !Data.trim()) {
      alert("Preencha todos os campos antes de adicionar!");
      return;
    }
    const novaTarefa = { 
      id: Date.now().toString(), Materia, Pagina, Data };
    setListaDeTarefas([...listaDeTarefas, novaTarefa]);
    setMateria(""); setPagina(""); setData("");
  };

  const excluirTarefa = (id) => setListaDeTarefas(listaDeTarefas.filter(t => t.id !== id));

  const enviarTarefas = () => {
    if (listaDeTarefas.length === 0) { alert("Adicione pelo menos uma tarefa!"); return; }

    // Navega para o Dashboard dentro da aba Home
    navigation.navigate("Principal", {
      screen: "Home",
      params: {
        screen: "Dashboard",
        params: { listaDeTarefas }
      }
    });
  };

  return (
      

    
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.Adicionar}>Adicionar Tarefas</Text></View>

      <TextInput placeholder="Matéria" value={Materia} 
      onChangeText={setMateria} style={styles.input}/>
      
      <TextInput placeholder="Página" value={Pagina} 
      onChangeText={setPagina} style={styles.input}/>
      
      <TextInput placeholder="Data" value={Data} 
      onChangeText={setData} style={styles.input}/>

      <Button title="Adicionar Tarefa" color="#38a69d" onPress={adicionarTarefa} />
      <FlatList
        style={styles.listaPreview}
        data={listaDeTarefas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.Materia} - {item.Pagina} - {item.Data}</Text>
            <TouchableOpacity onPress={() => excluirTarefa(item.id)}>
              <Text style={styles.excluir}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Concluir e Enviar" color="#38a69d" onPress={enviarTarefas} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#fff", 
    alignItems: "center", 
    justifyContent: "flex-start",
    paddingBottom: 50,
  },
  header: { 
    backgroundColor: "#38a69d", 
    paddingVertical: 40, 
    width: "100%", 
    alignItems: "center", 
    justifyContent: "center",
    marginBottom: 20,
  
    
  },
  Adicionar: { 
    fontSize: 25, 
    fontWeight: "bold", 
    color: "#ecf8f8ff", 
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "75%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
  },
  listaPreview: { 
    marginTop: 20, 
    width: "100%" 
  },
  item: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingVertical: 12, 
    paddingHorizontal: 8,
    borderBottomWidth: 1, 
    borderColor: "#f80909ff" 
  },
  excluir: { 
    color: "red", 
    fontSize: 16 
  },
  addButton: {
    alignSelf: "center",
    backgroundColor: "#e6e6e6",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  addText: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#333" 
  },
});