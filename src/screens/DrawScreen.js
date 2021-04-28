import "react-native-gesture-handler";
import React from "react";
import { Dimensions, PanResponder, StyleSheet, Text, View, SafeAreaView } from "react-native";
import Canvas from "react-native-canvas";
import UndoRedoBar from "../components/UndoRedoBar";
import { ThemeContext } from "../context/ThemeContext";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";
import {erase, eraseInPoly} from "../LineUtil";


const window = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
}

const DrawScreen = ({navigation}) => {

	const undosRef = React.useRef([])
	const redosRef = React.useRef([])

	const canvasRef = React.useRef(null)
	const ctxRef = React.useRef(null)

	const linesRef = React.useRef([])
	const drawingRef = React.useRef(false)
	const [penColor, setPenColor] = React.useState('black')
	const [lineWidth, setLineWidth] = React.useState(8)
	const [eraserLineWidth, setEraserLineWidth] = React.useState(13)
	const [tool, setTool] = React.useState('pen')

	const [theme] = React.useContext(ThemeContext)
	const [leftBarActive, setLeftBarActive] = React.useState(false)
	const [rightBarActive, setRightBarActive] = React.useState(false)
	const sideTabOpenBuffer = 15

	const gesturePoint = (gestureState) => {
		return [gestureState.x0 + gestureState.dx, gestureState.y0 + gestureState.dy]
	}

	const appendPoint = (point) => {
		const lines = linesRef.current
		lines[lines.length - 1].points.push(point)
	}

	const startLine = () => {
		const lines = linesRef.current
		lines.push({color: penColor, lineWidth: determineLineWidth(), points:[], type: undefined})
	}

	React.useEffect(() => {
		const canvas = canvasRef.current

		canvas.width = window.width
		canvas.height = window.height

		const ctx = canvas.getContext('2d')

		ctx.strokeStyle = 'black';
		ctx.lineWidth = lineWidth;
		ctx.lineCap = 'round'

		ctxRef.current = ctx
	}, [])

	const drawDot = (ctx, x, y, diameter, color) => {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, diameter / 2, 0, 2 * Math.PI, true);
		ctx.fill();
	}

	const determineLineWidth = () => {
		if (tool === 'eraser') return eraserLineWidth;
		if (tool === 'loop') return 5;
		return lineWidth
	}

	const renderCanvas = (ctx) => {

		ctx.clearRect(0, 0, window.width, window.height)

		const lines = linesRef.current
		for (const {color, points, lineWidth} of lines) {

			if (points.length === 0) {
				continue
			} else if (points.length === 1) {

				const point = points[0]
				drawDot(ctx, point[0], point[1], lineWidth, color)

			} else {

				const start = points[0]

				ctx.strokeStyle = color;
				ctx.lineWidth = lineWidth;

				ctx.beginPath();
				ctx.moveTo(start[0], start[1]);

				for (let i = 0; i < points.length; i++) {

					const point = points[i]

					ctx.lineTo(point[0], point[1]);
				}
				ctx.stroke();
			}
		}
	}

	const renderNew = (ctx) => {

		const lines = linesRef.current

		const line = lines[lines.length - 1]
		const points = line.points

		if (points.length < 1) return;

		const color = (tool === 'eraser' || tool === 'loop') ? '#FF000066' : penColor;

		if (points.length === 1) {

			const point = points[0]
			drawDot(ctx, point[0], point[1], line.lineWidth, color)

			return;
		}

		let i = points.length - 1

		const from = (points.length === 1) ? points[i] : points[i - 1]
		const to = points[i]

		ctx.lineWidth = line.lineWidth
		ctx.strokeStyle = color

		ctx.beginPath();
		ctx.moveTo(from[0], from[1]);
		ctx.lineTo(to[0], to[1])
		ctx.stroke();
	}

	const analyzeLine = () => {
		const lines = linesRef.current
		const line = lines[lines.length - 1]

		const points = line.points

		const newPoints = []

		const first = points[0]
		let minX = first[0], maxX = first[0]
		let minY = first[1], maxY = first[1]

		let last;
		for (let i = 0; i < points.length; i++) {
			const point = points[i]

			minX = Math.min(minX, point[0])
			minY = Math.min(minY, point[1])

			maxX = Math.max(maxX, point[0])
			maxY = Math.max(maxY, point[1])

			if (i === 0 || point[0] !== last[0] || point[1] !== last[1]) {
				newPoints.push(point)

			}
			last = point;
		}

		lines[lines.length - 1] = {...line, ...{
				points: newPoints,
				type: (newPoints.length === 1) ? 'dot' : 'line',
				minX, minY, maxX, maxY
			}}
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
		if (drawingRef.current) {
			drawingRef.current = false
			analyzeLine()

			if (tool === 'eraser') {
				linesRef.current = erase(linesRef.current)
				renderCanvas(ctxRef.current)
			}

			if (tool === 'loop') {
				linesRef.current = eraseInPoly(linesRef.current)
				renderCanvas(ctxRef.current)
			}
		}
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

				<LeftSideBar active={leftBarActive} setActive={setLeftBarActive} tool={tool} setTool={setTool} toSettings={() => navigation.navigate('Settings')}/>
				<RightSideBar active={rightBarActive} setActive={setRightBarActive} color={penColor} setColor={setPenColor}/>

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
