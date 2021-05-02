import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const window = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
}

const LeftSideBar = ({active, setActive, tool, setTool, toSettings, toSaves, smart, setSmart, rigging, setRigging}) => {
	
	const [theme] = React.useContext(ThemeContext)
	
	const tools = [
		[require('../../assets/penTool.png'), 'pen'],
		[require('../../assets/eraserTool.png'), 'eraser'],
		[require('../../assets/circleSelect.png'), 'loop'],
		[require('../../assets/line.png'), 'line'],
	]
	
	const toggles = [
		[require('../../assets/brain.png'), smart, setSmart],
		[require('../../assets/rig.jpg'), rigging, setRigging],
	]
	
	return (!active) ? null :
		<View style={[styles.sideBar, {backgroundColor: theme.sideBar, borderColor: theme.sideBarBorder}]}>
			
			<View style={{justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column'}}>
				<TouchableHighlight onPress={() => setActive(false)} style={{marginTop: 10}}>
					<Image
						source={require('../../assets/deleteButton.png')}
						style={[styles.button, {tintColor: theme.bottomBarButton}]}
					/>
				</TouchableHighlight>
				
				{tools.map(([image, thisTool], i) =>
					<TouchableHighlight onPress={() => setTool(thisTool)} key={`tool-${i}`} style={{marginTop: 10}}>
						<Image
							source={image}
							style={[styles.button, {tintColor: (tool === thisTool) ? theme.toolButtonActive : theme.bottomBarButton}]}
						/>
					</TouchableHighlight>
				)}
				
				{toggles.map(([image, toggle, setToggle], i) =>
					<TouchableHighlight onPress={() => setToggle(!toggle)} key={`toggle-${i}`} style={{marginTop: 10}}>
						<Image
							source={image}
							style={[styles.button, {tintColor: (toggle) ? theme.optionToggle : theme.bottomBarButton}]}
						/>
					</TouchableHighlight>
				)}
			</View>
			
			<View>
				<TouchableHighlight onPress={toSaves} style={{marginBottom: 10}}>
					<Image
						source={require('../../assets/saves.png')}
						style={[styles.button, {tintColor: theme.bottomBarButton}]}
					/>
				</TouchableHighlight>
				
				<TouchableHighlight onPress={toSettings} style={{marginBottom: 10}}>
					<Image
						source={require('../../assets/settings.png')}
						style={[styles.button, {tintColor: theme.bottomBarButton}]}
					/>
				</TouchableHighlight>
			</View>
		</View>;
	
}
export default LeftSideBar

const styles = StyleSheet.create({
	sideBar: {
		
		position: 'absolute',
		height: '100%',
		width: window.width * 0.15,
		borderRightWidth: 2,
		
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'column',
	},
	button: {
		width: 45,
		height: 45,
		resizeMode: 'contain',
	},
});
