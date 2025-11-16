import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

import Welcome from '../telas/Welcome';
import Login from '../telas/Login';
import Cadastro from '../telas/Cadastro';
import Dashboard from '../telas/Principal';
import Tarefas from '../telas/Tarefas';
import Agenda from '../telas/Agenda';
import Estatisticas from '../telas/Estatiticas';
import Aulas from '../telas/Aulas';
import Formulario from '../telas/Formulario';
import Sair from '../telas/Sair';
import Materias from '../telas/Materias';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions = {{ headerShown: false }}>
      <Stack.Screen name ="Welcome" component={Welcome} />
      <Stack.Screen name ="Login" component={Login} />
      <Stack.Screen name ="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
}

function FormularioStack() {
  return (
    <Stack.Navigator screenOptions = {{ headerShown: false }}>
      <Stack.Screen name ="Formulario" component={Formulario} />
      <Stack.Screen name ="Sair" component={Sair} />
    </Stack.Navigator>
  );
}

function PrincipalTabs() {
  return (
    <Drawer.Navigator screenOptions={{ headerStyle: { backgroundColor: '#38a69d' },
        headerTintColor: '#fff',
        contentStyle: { backgroundColor: '#4d1818ff' } }}>
      <Drawer.Screen 
        name="Home 🏠" 
        component={DashboardStack}
        options={{
          drawerLabel: 'Inicio',
          drawerIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Gerenciar Matérias 📚" 
        component={Materias}
        options={{
          drawerLabel: 'Gerenciar Matérias',
          drawerIcon: ({ color, size }) => (
            <Feather name="plus-square" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Gerenciar Tarefas 📚" 
        component={Tarefas}
        options={{
          drawerLabel: 'Gerenciar Tarefas',
          drawerIcon: ({ color, size }) => (
            <Feather name="plus-square" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Agenda 📅" 
        component={Agenda}
        options={{
          drawerLabel: 'Agenda',
          drawerIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />  
      <Drawer.Screen 
        name="Estatísticas 📊" 
        component={Estatisticas}
        options={{
          drawerLabel: 'Estatísticas',
          drawerIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size} color={color}/>
          ),
        }}
      />
      <Drawer.Screen 
        name="Aulas 🎓" 
        component={Aulas}
        options={{
          drawerLabel: 'Aulas',
          drawerIcon: ({ color, size }) => (
            <Feather name="book" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Atualizar Dados 📝" 
        component={Formulario}
        options={{
          drawerLabel: 'Atualizar Dados',
          drawerIcon: ({ color, size }) => (
            <Feather name="file-text" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Sair🚪" 
        component={Sair}
        options={{
          drawerLabel: 'Sair',
          drawerIcon: ({ color, size }) => (
            <Feather name="file-text" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// Stack principal do app
export default function Rotas() {

  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#38a69d" />
      </View>
    );
  }

  if (isLoggedIn) {
    if (user && user.curso !== null) {
      return <PrincipalTabs />;

    } else if (user && user.curso === null) {
      return <FormularioStack />;
    
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
          <ActivityIndicator size="large" color="#38a69d" />
        </View>
      );
    }
  } else {
    return <AuthStack />;
  }
}