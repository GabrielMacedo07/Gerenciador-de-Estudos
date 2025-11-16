import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Sair() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []); 
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#38a69d" />
      <Text style={styles.text}>Saindo...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#38a69d'
  }
});