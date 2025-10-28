import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { VictoryBar, VictoryChart, VictoryTheme, VictoryTooltip } from "victory-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Card from "../../componentes/Card";

export default function Dashboard({ navigation, route }) {
  const [usuario, setUsuario] = useState({
    nome: "Aluno",
    curso: "Desconhecido",
    periodo: "Desconhecido",
    idade: "Desconhecida",
  });
  const [tarefas, setTarefas] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [notas, setNotas] = useState([]);
  const [image, setImage] = useState(null);

  // Carrega dados do AsyncStorage e de route.params
  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        try {
          // Usuário
          const userData = await AsyncStorage.getItem("@usuario");
          if (userData) setUsuario(JSON.parse(userData));

          // Tarefas
          if (route?.params?.listaDeTarefas) {
            setTarefas(route.params.listaDeTarefas);
            navigation.setParams({ listaDeTarefas: undefined });
          } else {
            const tarefasData = await AsyncStorage.getItem("@tarefas");
            if (tarefasData) setTarefas(JSON.parse(tarefasData));
          }

          // Agenda
          if (route?.params?.agenda) {
            setAgenda(route.params.agenda);
            navigation.setParams({ agenda: undefined });
          } else {
            const agendaData = await AsyncStorage.getItem("@agenda");
            if (agendaData) setAgenda(JSON.parse(agendaData));
          }

          // Notas
          const notasData = await AsyncStorage.getItem("@notas");
          if (notasData) setNotas(JSON.parse(notasData));

          // Imagem
          const imageData = await AsyncStorage.getItem("@imagem_perfil");
          if (imageData) setImage(imageData);
        } catch (e) {
          console.error("Erro ao carregar dados:", e);
        }
      };

      carregarDados();
    }, [route])
  );

  // Seleciona imagem de perfil
  const handleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        aspect: [4, 4],
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImage(uri);
        await AsyncStorage.setItem("@imagem_perfil", uri);
      }
    } catch (e) {
      console.error("Erro ao selecionar imagem:", e);
    }
  };

  // Apagar dados específicos
  const handleApagar = async (tipo) => {
    Alert.alert(
      "Confirmação",
      `Deseja apagar todos os ${tipo}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim",
          onPress: async () => {
            try {
              if (tipo === "tarefas") {
                setTarefas([]);
                await AsyncStorage.removeItem("@tarefas");
              } else if (tipo === "agenda") {
                setAgenda([]);
                await AsyncStorage.removeItem("@agenda");
              } else if (tipo === "notas") {
                setNotas([]);
                await AsyncStorage.removeItem("@notas");
              }
            } catch (e) {
              console.error(`Erro ao apagar ${tipo}:`, e);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const notasFormatadas = notas.map((n) => ({
    materia: n.materia,
    nota: Number(n.nota) || 0,
    label: `${n.materia}: ${n.nota}`,
  }));

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image
              source={image ? { uri: image } : require("../../assets/usuario.png")}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.aluno}>Olá,  {usuario.nome}!</Text>
            <Text style={styles.aluno}>Curso: {usuario.curso}</Text>
            <Text style={styles.aluno}>Período: {usuario.periodo}</Text>
            <Text style={styles.aluno}>Idade: {usuario.idade}</Text>
          </View>
        </View>
      </View>

      {/* Agenda */}
      <Card titulo="Agenda" action={
        <TouchableOpacity onPress={() => handleApagar("agenda")}>
          <Text style={styles.apagar}>X</Text>
        </TouchableOpacity>
      }>
        {agenda.length > 0 ? (
          agenda.map((a, i) => (
            <View key={i} style={{ marginBottom: 6 }}>
              <Text style={{ fontWeight: "bold" }}>{a.Materia}</Text>
              <Text>{a.Hora} - Sala {a.Sala} - Bloco {a.Bloco}</Text>
            </View>
          ))
        ) : (
          <Text>Nenhum horário cadastrado</Text>
        )}
      </Card>

      {/* Tarefas */}
      <Card titulo="Atividades de Hoje" action={
        <TouchableOpacity onPress={() => handleApagar("tarefas")}>
          <Text style={styles.apagar}>X</Text>
        </TouchableOpacity>
      }>
        {tarefas.length > 0 ? (
          tarefas.map((t, i) => (
            <View key={i} style={{ marginBottom: 6 }}>
              <Text style={{ fontWeight: "bold" }}>{t.Materia}</Text>
              <Text>Pág {t.Pagina} - {t.Data}</Text>
            </View>
          ))
        ) : (
          <Text>Nenhuma tarefa cadastrada</Text>
        )}
      </Card>

      {/* Notas */}
      <Card titulo="Notas" action={
        <TouchableOpacity onPress={() => handleApagar("notas")}>
          <Text style={styles.apagar}>X</Text>
        </TouchableOpacity>
      }>
        {notasFormatadas.length > 0 ? (
          <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
            <VictoryBar
              data={notasFormatadas}
              x="materia"
              y="nota"
              labels={({ datum }) => datum.label}
              labelComponent={<VictoryTooltip />}
              style={{ data: { fill: "#38a69d" } }}
            />
          </VictoryChart>
        ) : (
          <Text>Nenhuma nota lançada</Text>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f2f2f2" 
  },
  header: { backgroundColor: "#38a69d", paddingVertical: 40, paddingHorizontal: 10 },
  userInfo: { flexDirection: "row", alignItems: "center" },
  aluno: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  apagar: { color: "#ff3333", fontWeight: "bold", fontSize: 20 },
});
