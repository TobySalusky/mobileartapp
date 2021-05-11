import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { fromHsv, TriangleColorPicker } from 'react-native-color-picker'
import invert from 'invert-color';


const window = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
}

const RightSideBar = ({active, setActive, color, setColor, leftActive}) => { // TODO: try react-native-svg
	
	const [theme] = React.useContext(ThemeContext)
	const [customColor, setCustomColor] = React.useState('#FF0000');
	const [usingCustom, setUsingCustom] = React.useState(false);
	
	const customSet = (col) => {
		setCustomColor(col)
		setColor(col)
	}
	
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
		<View pointerEvents="box-none" style={{width: '100%', height: '100%', position: 'absolute'}}>
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
						<Swatch custom selectedColor={color} setColor={setColor} color={customColor}
						        setUsingCustom={setUsingCustom}
						        key={`custom`}/>
						{colors.map(thisColor => (
							<Swatch selectedColor={color} setColor={setColor} color={thisColor}
							        setUsingCustom={setUsingCustom}
							        key={`swatch-${thisColor}`}/>
						))}
					</View>
				</ScrollView>
			
			</View>
			{!usingCustom ? null :
				<View style={{
					position: 'absolute',
					top: 0,
					left: (leftActive) ? window.width * 0.15 : 0,
					width: (leftActive) ? window.width * 0.7 : window.width * 0.85,
					height: window.height * 0.4,
					backgroundColor: theme.bottomBar,
					justifyContent: 'center', alignItems: 'center',
					borderColor: theme.bottomBarBorder,
					borderBottomWidth: 2,
				}}>
					<TriangleColorPicker
						hideControls
						defaultColor={customColor}
						onColorChange={col => customSet(fromHsv(col))}
						style={{width: '90%', height: '90%'}}
					/>
				</View>
			}
		
		</View>
	
	
}
export default RightSideBar

const Swatch = ({selectedColor, color, setColor, custom, setUsingCustom}) => {
	
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
				onPress={() => {
					setUsingCustom(custom)
					setColor(color)
				}}>
				<View style={[styles.swatch, {backgroundColor: color}]}>
					{!custom ? null :
						<Text style={{color: invert(color, true), fontSize: 20, fontWeight: 'bold'}}>?</Text>
					}
				</View>
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
