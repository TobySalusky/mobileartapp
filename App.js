import "react-native-gesture-handler";
import React from "react";
import GlobalProvider from "./src/context/GlobalProvider";
import DrawScreen from "./src/screens/DrawScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from "./src/screens/SettingsScreen";


const Stack = createStackNavigator();

const App = () => {

  return (
      <GlobalProvider>
          <NavigationContainer>
              <Stack.Navigator initialRouteName="Draw" screenOptions={{headerShown: false}}>

                  <Stack.Screen name="Draw" component={DrawScreen} />
                  <Stack.Screen name="Settings" component={SettingsScreen} />

              </Stack.Navigator>
          </NavigationContainer>
      </GlobalProvider>
  );
}
export default App;
