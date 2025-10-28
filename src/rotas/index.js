
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';



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


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
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
        name="Adicionar Tarefas 📚" 
        component={Tarefas}
        options={{
          drawerLabel: 'Adicionar Tarefas',
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
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Principal" component={PrincipalTabs} />
      <Stack.Screen name="Agenda" component={Agenda} />
      <Stack.Screen name="Estatísticas" component={Estatisticas} />
      <Stack.Screen name="Aulas" component={Aulas} />
      <Stack.Screen name="Tarefas" component={Tarefas} />
      <Stack.Screen name="Formulario" component={Formulario} />
    
    </Stack.Navigator>
  );
}
