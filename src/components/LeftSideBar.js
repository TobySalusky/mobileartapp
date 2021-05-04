import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import Slider from "@react-native-community/slider";


const window = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
}

const LeftSideBar = ({
	                     active, setActive, tool, setTool, toSettings, toSaves, smart, setSmart, rigging, setRigging,
	                     lineWidth, setLineWidth, eraserWidth, setEraserWidth
                     }) => {
	
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
			
			{!(tool === 'pen' || tool === 'line') ? null :
				<SizeSlider width={lineWidth} setWidth={setLineWidth} max={15}/>
			}
			
			{!(tool === 'eraser') ? null :
				<SizeSlider width={eraserWidth} setWidth={setEraserWidth} max={20}/>
			}
			
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
		<View style={{transform: [{rotate: "-90deg"}]}}>
			<Slider style={{width: 100, height: 20}} value={temp.current} onValueChange={val => temp.current = val}
			        onSlidingComplete={val => setWidth(val)} minimumValue={1} maximumValue={max}
			        thumbTintColor={theme.sliderHead} minimumTrackTintColor={theme.sliderActive}
			        maximumTrackTintColor={theme.sliderInactive}/>
		</View>
		/*<View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
			<View style={{transform: [{rotate: "-90deg"}]}}>
				<Slider style={{width: 100, height: 20}} value={temp.current} onValueChange={val => temp.current = val}
				        onSlidingComplete={val => setWidth(val)} minimumValue={0} maximumValue={max}
				        thumbTintColor={theme.sliderHead} minimumTrackTintColor={theme.sliderActive}
				        maximumTrackTintColor={theme.sliderInactive}/>
			</View>
			<Text>
				{temp.current.toFixed(1)}
			</Text>
		</View>*/
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
