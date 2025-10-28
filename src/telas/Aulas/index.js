import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";

export default function Aulas() {
 
  const aulas = [
    {
      id: 1,
      titulo: "Introdução ao React Native",
      descricao:
        "Aprenda os conceitos básicos do React Native, incluindo a configuração do ambiente e a criação do seu primeiro app.",
      videoId: "a8YvzTXft9c",
    },
    {
      id: 2,
      titulo: "Guia para aprender React Native",
      descricao:
        "Entenda como criar componentes reutilizáveis e aplicar estilos com o StyleSheet.",
      videoId: "20WH5xB54Hc",
    },
    {
      id: 3,
      titulo: "Navegação entre Telas",
      descricao:
        "Aprenda a usar o React Navigation para criar rotas e trocar de tela no seu app.",
      videoId: "gH9Vvq6WbnA",
    },
  ];

  //  Estados de busca
  const [busca, setBusca] = useState("");
  const [resultado, setResultado] = useState(null);

  //  Função de busca
  const buscarAula = () => {
    const encontrada = aulas.find((aula) =>
      aula.titulo.toLowerCase().includes(busca.toLowerCase())
    );
    setResultado(encontrada || null);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.tituloPrincipal}>🎓 Aulas Disponíveis</Text>

      {/*Barra de busca */}
      <View style={styles.barraBusca}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome da aula..."
          value={busca}
          onChangeText={setBusca}
        />
        <TouchableOpacity style={styles.botaoBuscar} onPress={buscarAula}>
          <Text style={styles.textoBotao}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Resultado */}
      {resultado ? (
        <View style={styles.aulaContainer}>
          <YoutubeIframe videoId={resultado.videoId} height={300} width={400} />
          <Text style={styles.titulo}>{resultado.titulo}</Text>
          <Text style={styles.descricao}>{resultado.descricao}</Text>
        </View>
      ) : (
        <Text style={styles.textoNenhum}>
          {busca === ""
            ? "Digite o nome de uma aula para assistir 👇"
            : "Nenhuma aula encontrada 😕"}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  tituloPrincipal: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
  },
  barraBusca: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    width: 220,
    marginRight: 10,
  },
  botaoBuscar: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
  aulaContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  titulo: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
    color: "#333",
  },
  descricao: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 20,
    color: "#555",
  },
  textoNenhum: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 40,
  },
});
