import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";

export default function Agenda({ navigation }) {
  const [Materia, setMateria] = useState("");
  const [Hora, setHora] = useState("");
  const [Sala, setSala] = useState("");
  const [Bloco, setBloco] = useState("");
  const [aAgenda, setAgenda] = useState([]);

  const adicionarAtividade = () => {
    if (!Materia.trim() || !Hora.trim() || !Sala.trim() || !Bloco.trim()) {
      alert("Preencha todos os campos antes de adicionar!");
      return;
    }
    const novaAtividade = { 
      id: Date.now().toString(), Materia, Hora, Sala, Bloco };
    setAgenda([...aAgenda, novaAtividade]);
    setMateria(""); setHora(""); setSala(""); setBloco("");
  };

  const excluirAtividade = (id) => setAgenda(aAgenda.filter(a => a.id !== id));

  const enviarAtividades = () => {
    if (aAgenda.length === 0) { alert("Adicione pelo menos uma materia!"); return; }

    // Navega para o Dashboard dentro da aba Home
    navigation.navigate("Principal", {
      screen: "Home",
      params: {
        screen: "Dashboard",
        params: { agenda: aAgenda}
      }
    });
  };

  return (
      

    
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.Adicionar}>Organize seus horarios de estudos</Text></View>

      <TextInput placeholder="Matéria" value={Materia} 
      onChangeText={setMateria} style={styles.input}/>

      <TextInput placeholder="Hora" value={Hora} 
      onChangeText={setHora} style={styles.input} keyboardType="numeric"/>
      
      <TextInput placeholder="Sala" value={Sala} 
      onChangeText={setSala} style={styles.input}/>

      <TextInput placeholder="Bloco" value={Bloco} 
      onChangeText={setBloco} style={styles.input}/>

      <Button title="Adicionar Matéria" color="#38a69d" onPress={adicionarAtividade} />
      <FlatList
        style={styles.listaPreview}
        data={aAgenda}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.Materia} - {item.Hora} - {item.Sala} - {item.Bloco}</Text>
            <TouchableOpacity onPress={() => excluirAtividade(item.id)}>
              <Text style={styles.excluir}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Concluir e Enviar" color="#38a69d" onPress={enviarAtividades} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#fff", 
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