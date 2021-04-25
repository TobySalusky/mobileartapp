import React from "react";
import { StyleSheet, Text, View, Image, TouchableHighlight, Dimensions } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

const window = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
}

const RightSideBar = ({active, setActive, color, setColor}) => { // TODO: try react-native-svg

	const [theme] = React.useContext(ThemeContext)

	const colors = [
		'black',
		'white',
		'red',
		'blue',
		'green',
		'orange',
		'yellow',
		'purple',
		'pink'
	]

	return (!active) ? null :
			<View style={[styles.sideBar, {backgroundColor: theme.sideBar, borderColor: theme.sideBarBorder}]}>
				<TouchableHighlight
					onPress={() => setActive(false)}>
					<Image
						source={require('../../assets/deleteButton.png')}
						style={[styles.closeButton, {tintColor: theme.bottomBarButton}]}
					/>
				</TouchableHighlight>

				<View style={{justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column', flex:1}}>
					{colors.map(thisColor => (
						<Swatch selectedColor={color} setColor={setColor} color={thisColor} key={`swatch-${thisColor}`}/>
					))}
				</View>

			</View>;

}
export default RightSideBar

const Swatch = ({selectedColor, color, setColor}) => {
	return (
		<View style={[styles.swatch, {width: 45, height: 45,
			borderColor: (selectedColor === color) ? 'orange' : 'black', borderWidth: 2, backgroundColor: 'black',
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
