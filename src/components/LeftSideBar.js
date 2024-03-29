import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableHighlight, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import Slider from '@react-native-community/slider';


const window = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
}

const LeftSideBar = ({
	                     active, setActive, tool, setTool, toSettings, toSaves, smart, setSmart, rigging, setRigging,
	                     lineWidth, setLineWidth, eraserWidth, setEraserWidth, selectMode, setSelectMode
                     }) => {
	
	const [theme] = React.useContext(ThemeContext)
	
	const tools = [
		[require('../../assets/penTool.png'), 'pen'],
		[require('../../assets/dottedLine.png'), 'eraser'],
		[require('../../assets/circleSelect.png'), 'loop'],
		[require('../../assets/line.png'), 'line'],
	]
	
	const toggles = [
		[require('../../assets/brain.png'), smart, setSmart],
		//[require('../../assets/rig.jpg'), rigging, setRigging],
	]
	
	const selectToggles = [
		[require('../../assets/eraserTool.png'), 'erase'],
		[require('../../assets/move.png'), 'move'],
		[require('../../assets/fillBucket.png'), 'fill'],
		[require('../../assets/sendBack.png'), 'sendBack'],
		[require('../../assets/sendFront.png'), 'sendFront'],
	]
	
	return (!active) ? null :
		<View style={[styles.sideBar, {backgroundColor: theme.sideBar, borderColor: theme.sideBarBorder}]}>
			
			<TouchableHighlight onPress={() => setActive(false)} style={{marginTop: 10}}>
				<Image
					source={require('../../assets/deleteButton.png')}
					style={[styles.button, {tintColor: theme.bottomBarButton}]}
				/>
			</TouchableHighlight>
			
			<ScrollView contentContainerStyle={{alignItems: 'center'}} directionalLockEnabled={true}
			            automaticallyAdjustContentInsets={false} style={{alignSelf: 'stretch'}}>
				<View style={{
					justifyContent: 'flex-start',
					alignItems: 'center',
					flexDirection: 'column'
				}}>
					
					{tools.map(([image, thisTool], i) =>
						<TouchableHighlight onPress={() => setTool(thisTool)} key={`tool-${i}`} style={{marginTop: 10}}>
							<Image
								source={image}
								style={[styles.button, {tintColor: (tool === thisTool) ? theme.toolButtonActive : theme.bottomBarButton}]}
							/>
						</TouchableHighlight>
					)}
					
					{toggles.map(([image, toggle, setToggle], i) =>
						<TouchableHighlight onPress={() => setToggle(!toggle)} key={`toggle-${i}`}
						                    style={{marginTop: 10}}>
							<Image
								source={image}
								style={[styles.button, {tintColor: (toggle) ? theme.optionToggle : theme.bottomBarButton}]}
							/>
						</TouchableHighlight>
					)}
					
					{!(tool === 'eraser' || tool === 'loop') ? null :
						selectToggles.map(([image, thisSelectMode], i) =>
							<TouchableHighlight onPress={() => setSelectMode(thisSelectMode)} key={`toggle-${i}`}
							                    style={{marginTop: 10}}>
								<Image
									source={image}
									style={[styles.button, {tintColor: (selectMode === thisSelectMode) ? theme.optionToggle : theme.bottomBarButton}]}
								/>
							</TouchableHighlight>
						)
					}
					
					{!(tool === 'pen' || tool === 'line') ? null :
						<SizeSlider width={lineWidth} setWidth={setLineWidth} max={15}/>
					}
					
					{!(tool === 'eraser') ? null :
						<SizeSlider width={eraserWidth} setWidth={setEraserWidth} max={20}/>
					}
				</View>
			</ScrollView>
			
			
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


const SizeSlider = ({width, setWidth, max = 10}) => {
	
	const [theme] = React.useContext(ThemeContext)
	
	const temp = React.useRef(width)
	
	React.useEffect(() => {
		temp.current = width;
	}, [width])
	
	
	return (
		<View style={{height: 100, width: 20, paddingTop: 75, marginTop: 10}}>
			<View style={{transform: [{rotate: '-90deg'}]}}>
				<Slider style={{width: 100, height: 20}} value={temp.current} onValueChange={val => temp.current = val}
				        onSlidingComplete={val => setWidth(val)} minimumValue={1} maximumValue={max}
				        thumbTintColor={theme.sliderHead} minimumTrackTintColor={theme.sliderActive}
				        maximumTrackTintColor={theme.sliderInactive}/>
			</View>
		</View>
	)
}

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
