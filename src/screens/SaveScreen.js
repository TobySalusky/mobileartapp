import "react-native-gesture-handler";
import React from "react";
import { Dimensions, PanResponder, StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import {ThemeContext} from "../context/ThemeContext";
import ToggleSwitch from 'toggle-switch-react-native'
import * as Themes from "../Themes";


const window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

const SaveScreen = ({navigation}) => {

    const [theme] = React.useContext(ThemeContext)

    const cols = 3
    const arr = [...Array(20).keys()]

    const pad = () => {
        const diff = Math.ceil(arr.length / cols) * cols - arr.length

        const padded = [...arr]
        for (let i = 0; i < diff; i++) padded.push(null)
        return padded
    }

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.screenBack}]}>

            <Text style={{fontSize: 50, color: theme.text}}>
                Saves
            </Text>




            <ScrollView style={{width: window.width}} contentContainerStyle={{alignItems: 'center'}}>

                <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    {
                        [...Array(Math.ceil(arr.length / cols)).keys()].map(row => (
                            <View style={{flexDirection:'row', flex: 1, alignItems: 'center', justifyContent: 'space-between', width: window.width * 0.85}} key={`save-row-${row}`}>
                                {
                                    pad(arr).slice(row * cols, (row + 1) * cols).map((entry, col) => (
                                        <View style={{width:window.width * 0.85 / cols * 0.9, aspectRatio: window.width/window.height, marginTop: 10}} key={`save-${row}-${col}`}>
                                            {entry === null ? null :
                                                <View style={{height: '100%', backgroundColor: theme.canvasBackground, borderWidth: 2, borderColor: theme.bottomBarBorder}} key={`save-col-${entry}`}>
                                                    <Text>{row} {col}</Text>
                                                </View>
                                            }
                                        </View>
                                    ))
                                }
                            </View>
                        ))
                    }
                </View>
            </ScrollView>

        </SafeAreaView>
    );
}
export default SaveScreen;

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
