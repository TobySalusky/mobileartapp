import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import ToggleSwitch from 'toggle-switch-react-native'
import * as Themes from '../Themes';
import { SmartSettingsContext } from '../context/SmartSettingsContext';

const ThemeScreen = ({navigation}) => {
	
	const [theme, setTheme] = React.useContext(ThemeContext)
	
	const [smartSettings, setSmartSettings] = React.useContext(SmartSettingsContext)
	
	const themes = [
		Themes.light,
		Themes.dark,
		Themes.dracula,
		Themes.gruvbox,
		Themes.hacker,
		Themes.cottonCandy,
		Themes.christmas,
	]
	
	const subHeader = {fontSize: 40, color: theme.subText}
	
	const toUpper = (camelCase) => {
		const result = camelCase.replace(/([A-Z])/g, ' $1');
		return result.charAt(0).toUpperCase() + result.slice(1);
	}
	
	return (
		<SafeAreaView style={[styles.container, {backgroundColor: theme.screenBack}]}>
			
			<Text style={{fontSize: 50, fontWeight: 'bold', color: theme.otherText}}>
				Settings
			</Text>
			
			<Text style={subHeader}>Theme</Text>
			
			<View style={{flexDirection: 'column', alignItems: 'flex-end', marginBottom: 30}}>
				{themes.map(thisTheme => (
					<View style={{marginTop: 10}} key={`themeToggle${thisTheme.name}`}>
						<ToggleSwitch
							isOn={theme === thisTheme}
							onColor={thisTheme.toggleOn}
							offColor={theme.toggleOff}
							label={thisTheme.name}
							labelStyle={{fontSize: 30, color: theme.text}}
							size="large"
							onToggle={() => setTheme(thisTheme)}
						/>
					</View>
				))}
			</View>
			
			<Text style={subHeader}>Smart Settings</Text>
			
			<View style={{flexDirection: 'column', alignItems: 'flex-end', marginBottom: 30}}>
				
				{Object.keys(smartSettings).map(setting => (
					<View style={{marginTop: 10}} key={`smartSettingToggle${setting}`}>
						<ToggleSwitch
							isOn={smartSettings[setting]}
							onColor={theme.toggleOn}
							offColor={theme.toggleOff}
							label={toUpper(setting)}
							labelStyle={{fontSize: 30, color: theme.text}}
							size="large"
							onToggle={() => {
								const newSettings = {...smartSettings}
								newSettings[setting] = !smartSettings[setting]
								setSmartSettings(newSettings)
							}}
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
		alignItems: 'center',
	},
});
