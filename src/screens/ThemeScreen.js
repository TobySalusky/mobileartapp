import "react-native-gesture-handler";
import React from "react";
import { Dimensions, PanResponder, StyleSheet, Text, View, SafeAreaView } from "react-native";
import {ThemeContext} from "../context/ThemeContext";
import ToggleSwitch from 'toggle-switch-react-native'
import {isLightTheme, otherTheme} from "../Themes";
import * as Themes from "../Themes";


const ThemeScreen = ({navigation}) => {

    const [theme, setTheme] = React.useContext(ThemeContext)

    const themes = [
        Themes.light,
        Themes.dark,
        Themes.dracula,
    ]

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.screenBack}]}>

            <Text style={{fontSize: 50, color: theme.text}}>
                Settings
            </Text>

            <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                {themes.map(thisTheme => (
                    <View style={{marginTop: 10}} key={`themeToggle${thisTheme.name}`}>
                        <ToggleSwitch
                            isOn={theme === thisTheme}
                            onColor={thisTheme.toggleOn}
                            offColor={theme.toggleOff}
                            label={thisTheme.name}
                            labelStyle={{fontSize: 30,color: theme.text}}
                            size="large"
                            onToggle={() => setTheme(thisTheme)}
                        />
                    </View>
                ))}
            </View>


        </SafeAreaView>
    );
}
export default ThemeScreen;

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
