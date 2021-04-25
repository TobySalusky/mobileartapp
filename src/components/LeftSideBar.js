import React from "react";
import { StyleSheet, Text, View, Image, TouchableHighlight, Dimensions } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

const window = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
}

const LeftSideBar = ({active, setActive}) => {

	const [theme] = React.useContext(ThemeContext)

	return (!active) ? null :
			<View style={[styles.sideBar, {backgroundColor: theme.sideBar, borderColor: theme.sideBarBorder}]}>
				<TouchableHighlight
					onPress={() => setActive(false)}>
					<Image
						source={require('../../assets/deleteButton.png')}
						style={[styles.button, {tintColor: theme.bottomBarButton}]}
					/>
				</TouchableHighlight>
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
	}
});
