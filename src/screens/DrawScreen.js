import "react-native-gesture-handler";
import React from "react";
import { Dimensions, PanResponder, StyleSheet, Text, View, SafeAreaView } from "react-native";
import Canvas from "react-native-canvas";
import UndoRedoBar from "../components/UndoRedoBar";
import { ThemeContext } from "../context/ThemeContext";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";


const window = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
}

const DrawScreen = () => {

	const undosRef = React.useRef([])
	const redosRef = React.useRef([])

	const canvasRef = React.useRef(null)
	const ctxRef = React.useRef(null)

	const linesRef = React.useRef([])
	const drawingRef = React.useRef(false)

	const [theme] = React.useContext(ThemeContext)

	const [leftBarActive, setLeftBarActive] = React.useState(false)
	const [rightBarActive, setRightBarActive] = React.useState(false)
	const sideTabOpenBuffer = 8

	const gesturePoint = (gestureState) => {
		return {x:gestureState.x0 + gestureState.dx, y:gestureState.y0 + gestureState.dy}
	}

	const appendPoint = (point) => {
		const lines = linesRef.current
		lines[lines.length - 1].push(point)
	}

	const startLine = () => {
		const lines = linesRef.current
		lines.push([])
	}

	React.useEffect(() => {
		const canvas = canvasRef.current

		canvas.width = window.width
		canvas.height = window.height

		const ctx = canvas.getContext('2d')

		ctx.strokeStyle = 'black';
		ctx.lineWidth = 8;
		ctx.lineCap = 'round'

		ctxRef.current = ctx
	}, [])

	const renderCanvas = (ctx) => {

		ctx.clearRect(0, 0, window.width, window.height)

		const lines = linesRef.current
		for (const points of lines) {

			if (points.length === 0) continue

			const start = points[0]
			ctx.beginPath();
			ctx.moveTo(start.x, start.y);

			for (let i = 0; i < points.length; i++) {

				const point = points[i]

				ctx.lineTo(point.x, point.y);
			}
			ctx.stroke();
		}
	}

	const renderNew = (ctx) => {

		const lines = linesRef.current

		const points = lines[lines.length - 1]

		if (points.length < 1) return;

		let i = points.length - 1
		const from = (points.length === 1) ? points[i] : points[i - 1]
		const to = points[i]

		ctx.beginPath();
		ctx.moveTo(from.x, from.y);
		ctx.lineTo(to.x, to.y)
		ctx.stroke();
	}

	const addUndo = () => {
		redosRef.current = []
		addUndoRaw()
	}

	const addUndoRaw = () => {
		undosRef.current.push([...linesRef.current]) // TODO: DEEP-COPY!!
	}

	const addRedo = () => {
		redosRef.current.push([...linesRef.current]) // TODO: DEEP-COPY!!
	}

	const undo = () => {

		const undos = undosRef.current
		if (undos.length > 0) {
			addRedo()

			linesRef.current = undos[undos.length - 1]
			undos.splice(undos.length - 1, 1)
			renderCanvas(ctxRef.current)
		}
	}

	const redo = () => {

		const redos = redosRef.current
		if (redos.length > 0) {
			addUndoRaw()

			linesRef.current = redos[redos.length - 1]
			redos.splice(redos.length - 1, 1)
			renderCanvas(ctxRef.current)
		}
	}

	const clearCanvas = () => {
		addUndo()

		console.log('cleared!');

		const lines = linesRef.current
		if (lines.length > 0) {
			lines.splice(0, lines.length)
			renderCanvas(ctxRef.current)
		}
	}

	const handlePanResponderMove = (event, gestureState) => {
		if (drawingRef.current) {
			appendPoint(gesturePoint(gestureState))
			renderNew(ctxRef.current)
		}
	};

	const handlePanResponderGrant = (event, gestureState) => {

		if (gestureState.x0 < sideTabOpenBuffer) {
			setLeftBarActive(true)
		} else if (gestureState.x0 > window.width - sideTabOpenBuffer) {
			setRightBarActive(true)
		} else {
			drawingRef.current = true

			addUndo()
			startLine()
			appendPoint(gesturePoint(gestureState))
			renderNew(ctxRef.current)
		}
	};


	const handlePanResponderEnd = (event, gestureState) => {
		drawingRef.current = false
	};



	const panResponderRef = PanResponder.create ( {
		onStartShouldSetPanResponder: () => true,
		onMoveShouldSetPanResponder: () => true,
		onPanResponderGrant: handlePanResponderGrant,
		onPanResponderMove: handlePanResponderMove,
		onPanResponderRelease: handlePanResponderEnd,
		onPanResponderTerminate: () => {}
	} );

	return (
		<SafeAreaView style={styles.container}>

			<View style={{flex: 1, flexDirection: 'row'}}>

				<View style={{flex:1, backgroundColor: theme.canvasBackground}} {...panResponderRef.panHandlers}>
					<Canvas ref={canvasRef}/>
				</View>

				<LeftSideBar active={leftBarActive} setActive={setLeftBarActive}/>
				<RightSideBar active={rightBarActive} setActive={setRightBarActive}/>

			</View>

			<UndoRedoBar undo={undo} clearCanvas={clearCanvas} redo={redo}/>

		</SafeAreaView>
	);
}
export default DrawScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	text: {
		color: 'black',
		fontSize: 40,
	}
});
