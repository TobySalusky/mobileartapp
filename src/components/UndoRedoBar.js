import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';


const window = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
}

const UndoRedoBar = ({undo, clearCanvas, redo, selectionActive, cancelMove, confirmMove}) => {
	
	const [theme] = React.useContext(ThemeContext)
	
	return (
		<View style={[styles.container, {backgroundColor: theme.bottomBar, borderColor: theme.bottomBarBorder}]}>
			{selectionActive ?
				<>
					<BarButton image={require('../../assets/deleteButton.png')} func={cancelMove}/>
					<BarButton image={require('../../assets/check.png')} func={confirmMove}/>
				</> :
				<>
					<BarButton image={require('../../assets/backArrow.png')} func={undo}/>
					<BarButton image={require('../../assets/deleteButton.png')} func={clearCanvas}/>
					<BarButton image={require('../../assets/forwardArrow.png')} func={redo}/>
				</>
			}
		
		</View>
	);
}

export default UndoRedoBar

const BarButton = ({image, func}) => {
	
	const [theme] = React.useContext(ThemeContext)
	
	return (
		<TouchableHighlight
			onPress={func}>
			
			<View style={styles.buttonPadding}>
				<Image
					source={image}
					style={[styles.button, {tintColor: theme.bottomBarButton}]}
				/>
			</View>
		
		</TouchableHighlight>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 50,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		
		borderTopWidth: 2,
	},
	buttonPadding: { // gives leeway when pressing buttons
		justifyContent: 'center',
		alignItems: 'center',
		
		height: '100%',
		width: Math.min(45 + 40, window.width / 3)
	},
	button: {
		width: 45,
		height: 45,
		resizeMode: 'contain',
	}
});
