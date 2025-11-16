import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../contexts/AuthContext";

// (Podemos manter os imports de Card e Victory, mas não vamos usá-los agora)
import { VictoryBar, VictoryChart, VictoryTheme, VictoryTooltip } from "victory-native";
import Card from "../../componentes/Card";

export default function Dashboard({ navigation }) {
  
  // 2. Pegue o objeto 'user' direto do nosso Contexto
  // Esse 'user' já contém nome, email, curso, periodoAtual, idade, etc.
  const { user } = useAuth(); 

  // 3. Estado apenas para a imagem de perfil (que ainda é local)
  const [image, setImage] = useState(null);

  // 4. 'useFocusEffect' simplificado: só carrega a imagem
  useFocusEffect(
    useCallback(() => {
      const carregarImagem = async () => {
        try {
          const imageData = await AsyncStorage.getItem("@imagem_perfil");
          if (imageData) setImage(imageData);
        } catch (e) {
          console.error("Erro ao carregar imagem:", e);
        }
      };
      carregarImagem();
    }, [])
  );

  // Função para selecionar imagem (mantida igual)
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

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho com os dados do usuário */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image
              source={image ? { uri: image } : require("../../assets/usuario.png")}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 10, flex: 1}}>
            <Text style={styles.aluno}>Olá, {user?.nome || "Aluno"}!</Text>
            <Text style={styles.aluno}>Curso: {user?.curso || "Não informado"}</Text>
            <Text style={styles.aluno}>Período: {user?.periodoAtual || "Não informado"}</Text>
            <Text style={styles.aluno}>Idade: {user?.idade ? user.idade + " anos" : "Não informada"}</Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <Text style={{ textAlign: 'center', color: '#666' }}>
          (Cards de Agenda, Tarefas e Notas virão em breve...)
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f2f2f2" 
  },
  header: { 
    backgroundColor: "#38a69d", 
    paddingVertical: 40, 
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
  },
  userInfo: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  aluno: { 
    color: "#fff", 
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2 
  },
});