
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Feather } from '@expo/vector-icons';


import Welcome from '../telas/Welcome';
import Login from '../telas/Login';
import Cadastro from '../telas/Cadastro';
import Dashboard from '../telas/Principal';
import Tarefas from '../telas/Tarefas';
import Agenda from '../telas/Agenda';
import Estatisticas from '../telas/Estatiticas';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack para gerenciar Dashboard e suas telas internas
function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
}

// Abas principais
function PrincipalTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={DashboardStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Adicionar Tarefas" 
        component={Tarefas}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-square" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Agenda" 
        component={Agenda}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Estatísticas" 
        component={Estatisticas}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Stack principal do app
export default function Rotas() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Principal" component={PrincipalTabs} />
      <Stack.Screen name="Agenda" component={Agenda} />
      <Stack.Screen name="Estatísticas" component={Estatisticas} />
    </Stack.Navigator>
  );
}
