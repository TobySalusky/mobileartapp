import "react-native-gesture-handler";
import React from "react";
import { Dimensions, PanResponder, StyleSheet, Text, View, SafeAreaView } from "react-native";
import {ThemeContext} from "../context/ThemeContext";
import ToggleSwitch from 'toggle-switch-react-native'
import {isLightTheme, otherTheme} from "../Themes";

const SettingsScreen = ({navigation}) => {

    const [theme, setTheme] = React.useContext(ThemeContext)

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.bottomBar}]}>

            <Text style={{fontSize: 50, color: theme.text}}>
                Settings
            </Text>

            <ToggleSwitch
                isOn={!isLightTheme(theme)}
                onColor='green'
                offColor='gray'
                label="Dark Mode"
                labelStyle={{fontSize: 30,color: theme.text}}
                size="large"
                onToggle={() => setTheme(otherTheme(theme))}
            />

        </SafeAreaView>
    );
}
export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    header: {
        fontSize: 40,
    }
});
