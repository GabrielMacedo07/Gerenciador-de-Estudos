import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity,Image} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native";  
import Card from "../../componentes/Card";



export default function Dashboard({ navigation, route }) {
  const [tarefas, setTarefas] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [image, setImage] = useState(null);
  const [notas, setNotas] = useState([]);

  const { nome, curso, periodo } = route.params || {};

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      aspect: [4, 4],
      allowsEditing: true,
      base64: true,
      quality: 1,
    
    
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

 useFocusEffect(
  React.useCallback(() => {
    // Atualiza tarefas
    if (route.params?.listaDeTarefas) {
      setTarefas(route.params.listaDeTarefas);
      navigation.setParams({ listaDeTarefas: undefined });
    }

    // Atualiza agenda
    if (route.params?.agenda) {
      setAgenda(route.params.agenda); // supondo que você tenha um estado agenda
      navigation.setParams({ agenda: undefined });
    }

  }, [route.params?.listaDeTarefas, route.params?.agenda])
);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
  <View style={styles.userInfo}>
    <TouchableOpacity onPress={handleImagePick}>
      <Image
        source={image ? { uri: image } : require("../../assets/logo.png")}
        style={{ width: 80, height: 80, borderRadius: 40 }}
      />
    </TouchableOpacity>
    <View style={{ marginLeft: 10 }}>
      <Text style={styles.aluno}>Olá, {nome || 'Aluno'}!</Text>
      <Text style={styles.aluno}>Curso: {curso || 'Desconhecido'}</Text>
      <Text style={styles.aluno}>Período: {periodo || 'Desconhecido'}</Text>
    </View>
  </View>
</View>


       <Card titulo="Agenda">
        {agenda.length > 0 ? (
          agenda.map((a, i) => (
            <View key={i} style={{ marginBottom: 6 }}>
              <Text style={{ fontWeight: "bold" }}>{a.Materia}</Text>
              <Text>{a.Hora} -Sala {a.Sala} -Bloco {a.Bloco}</Text>
            </View>
          ))
        ) : (
          <Text>Adicione seus horarios</Text>
        )}
      </Card>

      <Card titulo="Atividades de Hoje">
        {tarefas.length > 0 ? (
          tarefas.map((t, i) => (
            <View key={i} style={{ marginBottom: 6 }}>
              <Text style={{ fontWeight: "bold" }}>{t.Materia}</Text>
              <Text>Pag {t.Pagina} - {t.Data}</Text>
            </View>
          ))
        ) : (
          <Text>Nenhuma tarefa cadastrada</Text>
        )}
      </Card>
      <Card titulo="Notas">
        {notas.length > 0 ? (
          <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
            <VictoryBar
              data={notas}
              x="materia"
              y="nota"
              style={{ data: { fill: "#38a69d" } }}
            />
          </VictoryChart>
        ) : (
          <Text>Nenhuma nota lançada</Text>
        )}
      </Card>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  header: { backgroundColor: "#38a69d", paddingVertical: 40, paddingHorizontal: 10 },
  userInfo: { flexDirection: "row", alignItems: "center"},
  aluno: { color: "#fff", fontSize: 20, fontWeight: "bold" , paddingLeft: 15},
  addButton: {
    alignSelf: "center",
    backgroundColor: "#e6e6e6",
    borderRadius: 8,
    padding: 12,
  },
  addText: { fontSize: 20, fontWeight: "bold", color: "#333" },
});
