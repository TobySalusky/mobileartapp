import React from "react";
import { StyleSheet, Text, View, Image, TouchableHighlight, Dimensions } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

const window = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
}

const LeftSideBar = ({active, setActive, tool, setTool}) => {

	const [theme] = React.useContext(ThemeContext)

	const tools = [
		[require('../../assets/penTool.png'), 'pen'],
		[require('../../assets/eraserTool.png'), 'eraser'],
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

				{tools.map(([image, thisTool], i) =>
					<TouchableHighlight onPress={() => setTool(thisTool)} key={`tool-${i}`}>
						<Image
							source={image}
							style={[styles.closeButton, {tintColor: (tool === thisTool) ? theme.toolButtonActive : theme.bottomBarButton}]}
						/>
					</TouchableHighlight>
				)}
			</View>;

}
export default LeftSideBar

const styles = StyleSheet.create({
	sideBar: {

		position: 'absolute',
		height: '100%',
		width: window.width * 0.15,
		borderRightWidth: 2,

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

	toolButton: {
		width: 45,
		height: 45,
		resizeMode: 'contain',
	},
});
