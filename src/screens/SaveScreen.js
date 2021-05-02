import 'react-native-gesture-handler';
import React from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { DataURLContext } from '../context/DataURLContext';


const window = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
}

const SaveScreen = ({navigation}) => {
	
	const [theme] = React.useContext(ThemeContext)
	const [dataURL] = React.useContext(DataURLContext)
	
	const cols = 3
	const arr = [...Array(20).keys()]
	
	const pad = () => {
		const diff = Math.ceil(arr.length / cols) * cols - arr.length
		
		const padded = [...arr]
		for (let i = 0; i < diff; i++) padded.push(null)
		return padded
	}
	
	const base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII=';
	
	
	return (
		<SafeAreaView style={[styles.container, {backgroundColor: theme.screenBack}]}>
			
			<Text style={{fontSize: 50, color: theme.text}}>
				Saves
			</Text>
			
			
			<ScrollView style={{width: window.width}} contentContainerStyle={{alignItems: 'center'}}>
				
				<View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
					{
						[...Array(Math.ceil(arr.length / cols)).keys()].map(row => (
							<View style={{
								flexDirection: 'row',
								flex: 1,
								alignItems: 'center',
								justifyContent: 'space-between',
								width: window.width * 0.85
							}} key={`save-row-${row}`}>
								{
									pad(arr).slice(row * cols, (row + 1) * cols).map((entry, col) => (
										<View style={{
											width: window.width * 0.85 / cols * 0.9,
											aspectRatio: window.width / window.height,
											marginTop: 10
										}} key={`save-${row}-${col}`}>
											{entry === null ? null :
												<View style={{
													height: '100%',
													backgroundColor: theme.canvasBackground,
													borderWidth: 2,
													borderColor: theme.bottomBarBorder
												}} key={`save-col-${entry}`}>
													<Text>{row} {col}</Text>
													{!dataURL ? null :
														<View>
															<Text>img</Text>
															
															<Image style={{
																width: 100,
																height: 50,
																borderWidth: 1,
																borderColor: 'red'
															}} source={{uri: base64Icon}}/>
															
															
															<Image style={{
																width: 100,
																height: 50,
																borderWidth: 1,
																borderColor: 'red'
															}}
															       source={{uri: dataURL}}
															/>
														</View>
														
													}
												
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
	},
	image: {
		width: 100,
		height: 100,
		resizeMode: 'contain',
	}
});
