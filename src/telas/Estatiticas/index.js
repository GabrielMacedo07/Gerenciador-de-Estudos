import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Estatisticas() {
    const [materia, setMateria] = useState('');
    const [nota, setNota] = useState('');
    const [notaLista, setNotaLista] = useState([]);

    const carregarNotas = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@notas');
            const notasCarregadas = jsonValue != null ? JSON.parse(jsonValue) : [];
            setNotaLista(notasCarregadas);
        } catch (e) {
            console.error("Erro ao carregar notas: ", e);
        }
    };

    React.useEffect(() => {
        carregarNotas();
    }, []);
    
    const salvarNotas = async () => {
        if (!materia.trim() || !nota.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        const notaNumero = parseFloat(nota);
        if (isNaN(notaNumero) || notaNumero < 0 || notaNumero > 10) {
            Alert.alert('Erro', 'A nota deve ser um número entre 0 e 10.');
            return;
        }

        try {
            const jsonValue = await AsyncStorage.getItem('@notas');
            const notas = jsonValue != null ? JSON.parse(jsonValue) : [];

            // Adiciona nova nota

             const novaNota = { materia: materia.trim(), nota: notaNumero };
        notas.push(novaNota);
            
            // Salva Notas

            await AsyncStorage.setItem('@notas', JSON.stringify(notas));
            
            setNotaLista(notas);

            Alert.alert('Sucesso', 'Nota salva com sucesso!');
            setMateria('');
            setNota('');


        } catch (erro) {
            Alert.alert('Erro', 'Ocorreu um erro ao salvar a nota.');
        }   
    };

    const limparNotas = async () => {
  try {
    await AsyncStorage.removeItem('@notas'); // remove todas as notas
    setNotaLista([]); // atualiza a lista na tela
    Alert.alert('Sucesso', 'Todas as notas foram apagadas!');
  } catch (erro) {
    Alert.alert('Erro', 'Não foi possível apagar as notas.');
  }
};

      return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gerencie suas notas </Text>

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

      <TouchableOpacity style={[styles.button, {
         backgroundColor: '#ff4d4d', 
         marginTop: 10 }]} 
         onPress={limparNotas}>

  <Text style={styles.buttonText}>Limpar Estatísticas</Text>
</TouchableOpacity>

         <Text style={[styles.titulo, { marginTop: 20 }]}>Notas Cadastradas</Text>

      {notaLista.length === 0 ? (
        <Text>Nenhuma nota cadastrada ainda.</Text>
      ) : (
        <FlatList
          data={notaLista}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.notaItem}>{item.materia}: {item.nota}</Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    width: '75%',
  },
  button: {
    backgroundColor: "#38a69d",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    width: '75%',
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  notaItem: { fontSize: 16, marginVertical: 4},
});     