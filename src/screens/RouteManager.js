import React from "react";
import DrawScreen from "./DrawScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ThemeScreen from "./ThemeScreen";
import {ThemeContext} from "../context/ThemeContext";
import {SafeAreaView, StatusBar, StyleSheet, View} from "react-native";
import SaveScreen from "./SaveScreen";

const Stack = createStackNavigator();

const RouteManager = () => {

    const [theme] = React.useContext(ThemeContext)

    return (
        <View style={[styles.container, {backgroundColor: theme.screenBack}]}>
            <StatusBar translucent backgroundColor={theme.screenBack} barStyle={theme.statusBarStyle}/>

            <SafeAreaView style={styles.container}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Draw" screenOptions={{headerShown: false}}>

                        <Stack.Screen name="Draw" component={DrawScreen} />
                        <Stack.Screen name="Saves" component={SaveScreen} />
                        <Stack.Screen name="Settings" component={ThemeScreen} />

                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </View>
    );
}
export default RouteManager;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
});
