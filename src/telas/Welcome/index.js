
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity} 
from "react-native";
import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native';

export default function Welcome(){
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      
<Text style={[styles.title, { textAlign: 'center' }]}>
  Monitorador de estudo
</Text>
     
      <View style={styles.containerLogo}> 
        <Animatable.Image
        animation="flipInY"
        source={require('../../assets/logo.png')}
        style={{ width: '80%'}}
        resizeMode="contain"
        
        />
        

      </View>

      <Animatable.View delay={(600)} animation="fadeInUp" style={styles.containerForm}>
        <Text style={[styles.title, { textAlign: 'center' }]}>
  Organize seus estudos
</Text>
        <Text style={styles.text}>Faça seu login para começar</Text>

        <TouchableOpacity 
        style={styles.button}
        onPress={ () => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
      </Animatable.View>
          
     </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#38a69d'
  },
  containerLogo:{
    flex:2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm:{
    flex:1,
    backgroundColor: '#ffffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 12,
    
  },
  text:{
    color: '#38a69d',
    alignSelf: 'center',
  },
  button:{
    position: 'absolute',
    backgroundColor: '#030401ff',
    borderRadius: 50,
    paddingVertical: 8,
    width: '60%',
    bottom: '15%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText:{
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',

  }
})
