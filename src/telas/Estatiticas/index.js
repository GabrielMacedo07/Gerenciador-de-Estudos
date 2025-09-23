import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Estatisticas({ navigation }) {
    const [materia, setMateria] = useState('');
    const [nota, setNota] = useState('');
    
    const salvarNotas = async () => {
        if (materia === '' || nota === '') {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        try {
            const jsonValue = await AsyncStorage.getItem('@notas');
            const notas = jsonValue != null ? JSON.parse(jsonValue) : [];

            // Adiciona nova nota

            const novaNota = { materia: materia, nota: parseFloat(nota) };
            notas.push(novaNota);
            
            // Salva Notas

            await AsyncStorage.setItem('@notas', JSON.stringify(notas));

            Alert.alert('Sucesso', 'Nota salva com sucesso!');
            setMateria('');
            setNota('');

        } catch (erro) {
            Alert.alert('Erro', 'Ocorreu um erro ao salvar a nota.');
        }   
    };

      return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lançar Nota</Text>

      <TextInput
        style={styles.input}
        placeholder="Matéria"
        value={materia}
        onChangeText={setMateria}
      />

      <TextInput
        style={styles.input}
        placeholder="Nota"
        keyboardType="numeric"
        value={nota}
        onChangeText={setNota}
      />

      <TouchableOpacity style={styles.button} onPress={salvarNotas}>
        <Text style={styles.buttonText}>Salvar Nota</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#38a69d",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});