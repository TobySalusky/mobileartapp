import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, TouchableHighlight, View } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { TriangleColorPicker } from 'react-native-color-picker'


const window = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
}

const RightSideBar = ({active, setActive, color, setColor}) => { // TODO: try react-native-svg
	
	const [theme] = React.useContext(ThemeContext)
	
	const colors = [
		'black',
		'white',
		'gray',
		'#444444',
		'red',
		'blue',
		'green',
		'orange',
		'yellow',
		'purple',
		'pink'
	]
	
	return (!active) ? null :
		<View style={{width: '100%', height: '100%', position: 'absolute'}}>
			<View style={[styles.sideBar, {backgroundColor: theme.sideBar, borderColor: theme.sideBarBorder}]}>
				<TouchableHighlight
					onPress={() => setActive(false)}>
					<Image
						source={require('../../assets/deleteButton.png')}
						style={[styles.closeButton, {tintColor: theme.bottomBarButton}]}
					/>
				</TouchableHighlight>
				<ScrollView>
					<View style={{
						justifyContent: 'space-around',
						alignItems: 'center',
						flexDirection: 'column',
						flex: 1
					}}>
						{colors.map(thisColor => (
							<Swatch selectedColor={color} setColor={setColor} color={thisColor}
							        key={`swatch-${thisColor}`}/>
						))}
					</View>
				</ScrollView>
			
			</View>
			
			<View style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: window.width * 0.85,
				height: window.height * 0.4,
				backgroundColor: theme.bottomBar,
				justifyContent: 'center', alignItems: 'center',
				borderColor: theme.bottomBarBorder,
				borderBottomWidth: 2,
			}}>
				<TriangleColorPicker
					onColorSelected={color => alert(`Color selected: ${color}`)}
					style={{width: '90%', height: '90%'}}
				/>
			</View>
		
		</View>
	
	
}
export default RightSideBar

const Swatch = ({selectedColor, color, setColor}) => {
	
	const [theme] = React.useContext(ThemeContext)
	
	return (
		<View style={[styles.swatch, {
			width: 45,
			height: 45,
			borderColor: (selectedColor === color) ? theme.toolButtonActive : 'black',
			borderWidth: 2,
			backgroundColor: 'black',
			marginBottom: 10
		}]}>
			<TouchableHighlight
				onPress={() => setColor(color)}>
				<View style={[styles.swatch, {backgroundColor: color}]}/>
			</TouchableHighlight>
		</View>
	);
}

const styles = StyleSheet.create({
	sideBar: {
		right: 0,
		
		position: 'absolute',
		height: '100%',
		width: window.width * 0.15,
		borderLeftWidth: 2,
		
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'column',
	},
	closeButton: {
		width: 45,
		height: 45,
		resizeMode: 'contain',
		marginTop: 10,
	},
	swatch: {
		width: 35,
		height: 35,
		borderRadius: 8,
		borderColor: 'black',
		justifyContent: 'center',
		alignItems: 'center',
	}
});
