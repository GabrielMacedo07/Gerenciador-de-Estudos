import { createNativeStackNavigator} from '@react-navigation/native-stack'

import Welcome from '../telas/Welcome'
import Login from '../telas/Login'
import Cadastro from '../telas/Cadastro'

const Stack = createNativeStackNavigator();

export default function Rotas(){
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome"
    component={Welcome} 
    options={{ headerShown: false }} />

      <Stack.Screen name="Login" 
      component={Login} 
      options={{ headerShown: false }} />

        <Stack.Screen name="Cadastro" 
      component={Cadastro} 
      options={{ headerShown: false }} />

    </Stack.Navigator>
  )
}
