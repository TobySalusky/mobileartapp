import 'react-native-gesture-handler';
import React from 'react';
import { Dimensions, PanResponder, StyleSheet, View, } from 'react-native';
import Canvas, { Path2D } from 'react-native-canvas';
import UndoRedoBar from '../components/UndoRedoBar';
import { ThemeContext } from '../context/ThemeContext';
import LeftSideBar from '../components/LeftSideBar';
import RightSideBar from '../components/RightSideBar';
import {
	colorSelected,
	eraseSelection,
	exceptLast,
	lastLine,
	selectInPoly,
	selectTouching,
	smartLineSnapEnds,
	smartSnapSelf,
	snipIntersections,
} from '../LineUtil';
import { DataURLContext } from '../context/DataURLContext';
import { SmartSettingsContext } from '../context/SmartSettingsContext';
import { CanvasDimensContext } from '../context/CanvasDimensContext';
import { SavesContext } from '../context/SavesContext';
import { ApplySaveContext } from '../context/ApplySaveContext';


const window = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height,
};

const DrawScreen = ({navigation}) => {
	const undosRef = React.useRef([]);
	const redosRef = React.useRef([]);
	
	const canvasRef = React.useRef(null);
	const ctxRef = React.useRef(null);
	
	const [canvasViewDimens, setCanvasViewDimens] = React.useContext(CanvasDimensContext);
	
	const linesRef = React.useRef([]);
	const drawingRef = React.useRef(false);
	const [penColor, setPenColor] = React.useState('black');
	const [lineWidth, setLineWidth] = React.useState(8);
	const [eraserLineWidth, setEraserLineWidth] = React.useState(13);
	const [tool, setTool] = React.useState('pen');
	
	const [selectionActive, setSelectionActive] = React.useState(false)
	const selection = React.useRef({
		type: 'lines',
		data: []
	}); // either 'lines' or 'points'
	const [selectMode, setSelectMode] = React.useState('erase')
	
	const [saves, setSaves] = React.useContext(SavesContext);
	const [applySave, setApplySave] = React.useContext(ApplySaveContext);
	const [saveIndex, setSaveIndex] = React.useState(0);
	
	const [theme] = React.useContext(ThemeContext);
	const [leftBarActive, setLeftBarActive] = React.useState(false);
	const [rightBarActive, setRightBarActive] = React.useState(false);
	const sideTabOpenBuffer = 25;
	
	const [smart, setSmart] = React.useState(true)
	const [smartSettings, setSmartSettings] = React.useContext(SmartSettingsContext)
	
	const [rigging, setRigging] = React.useState(false)
	const prevTool = React.useRef('invalidTool')
	
	const [dataURL, setDataURL] = React.useContext(DataURLContext)
	
	React.useEffect(() => {
		const funcObj = {func: (save, index, dimens) => loadSave(save, index, dimens)};
		setApplySave(funcObj);
	}, [])
	
	React.useEffect(() => {
		if (rigging && tool !== 'line') setRigging(false)
	}, [tool])
	
	const gesturePoint = (gestureState) => {
		return [
			gestureState.x0 + gestureState.dx,
			gestureState.y0 + gestureState.dy,
		];
	};
	
	const appendPoint = (point) => {
		const lines = linesRef.current;
		lines[lines.length - 1].points.push(point);
	};
	
	const startLine = () => {
		const lines = linesRef.current;
		lines.push({
			color: determineColor(),
			lineWidth: determineLineWidth(),
			points: [],
			type: undefined,
		});
	};
	
	React.useEffect(() => {
		const canvas = canvasRef.current;
		
		canvas.width = canvasViewDimens.width;
		canvas.height = canvasViewDimens.height;
		
		const ctx = canvas.getContext('2d');
		
		ctx.strokeStyle = 'black';
		ctx.lineWidth = lineWidth;
		ctx.lineCap = 'round';
		
		ctxRef.current = ctx;
		
		renderCanvas(ctx);
	}, [canvasRef.current, canvasViewDimens]);
	
	const drawDot = (ctx, x, y, diameter, color) => {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, diameter / 2, 0, 2 * Math.PI, true);
		ctx.fill();
	};
	
	const determineLineWidth = () => {
		if (tool === 'eraser') return eraserLineWidth;
		if (tool === 'loop') return 5;
		if (tool === 'line' && rigging) return 7;
		return lineWidth;
	};
	
	const determineColor = () => {
		if (rigging) return '#FF000066';
		if (tool === 'eraser' || tool === 'loop') {
			if (selectMode === 'erase') return '#FF000066';
			if (selectMode === 'move') return '#00FF0066';
			if (selectMode === 'fill') return '#0077FF66';
			if (selectMode === 'sendBack' || selectMode === 'sendFront') return '#FF00FF66';
			
		}
		return penColor;
	};
	
	const renderCanvas = (ctx) => {
		renderLines(ctx, linesRef.current, canvasViewDimens)
	};
	
	const renderLines = (ctx, lines, dimens) => {
		ctx.clearRect(0, 0, dimens.width, dimens.height);
		
		for (const {color, points, lineWidth, svgPath} of lines) {
			
			if (points.length === 0 || !svgPath) continue;
			
			if (points.length === 1) {
				
				const point = points[0];
				drawDot(ctx, point[0], point[1], lineWidth, color);
				
			} else {
				
				ctx.strokeStyle = color;
				ctx.lineWidth = lineWidth;
				
				let path2D = new Path2D(canvasRef.current, svgPath);
				ctx.fillStyle = 'red'
				ctx.stroke(path2D)
			}
		}
	};
	
	const renderNew = (ctx) => {
		const lines = linesRef.current;
		
		const line = lines[lines.length - 1];
		const points = line.points;
		
		if (points.length < 1) return;
		
		const color = line.color;
		
		if (points.length === 1) {
			const point = points[0];
			drawDot(ctx, point[0], point[1], line.lineWidth, color);
			
			return;
		}
		
		let i = points.length - 1;
		
		const from = points.length === 1 ? points[i] : points[i - 1];
		const to = points[i];
		
		ctx.lineWidth = line.lineWidth;
		ctx.strokeStyle = color;
		
		ctx.beginPath();
		ctx.moveTo(from[0], from[1]);
		ctx.lineTo(to[0], to[1]);
		ctx.stroke();
	};
	
	const analyze = (line) => {
		const points = line.points;
		
		const newPoints = [];
		
		const first = points[0];
		let minX = first[0],
			maxX = first[0];
		let minY = first[1],
			maxY = first[1];
		
		let last;
		for (let i = 0; i < points.length; i++) {
			const point = points[i];
			
			minX = Math.min(minX, point[0]);
			minY = Math.min(minY, point[1]);
			
			maxX = Math.max(maxX, point[0]);
			maxY = Math.max(maxY, point[1]);
			
			if (i === 0 || point[0] !== last[0] || point[1] !== last[1]) {
				newPoints.push(point);
			}
			last = point;
		}
		
		line.points = newPoints;
		line.type = newPoints.length === 1 ? 'dot' : 'line';
		line.svgPath = genSvgPath(newPoints);
		line.minX = minX;
		line.minY = minY;
		line.maxX = maxX;
		line.maxY = maxY;
	}
	
	const analyzeLine = () => {
		const lines = linesRef.current;
		const line = lines[lines.length - 1];
		
		analyze(line);
	};
	
	const genSvgPath = (points) => {
		let svgPath = 'M '
		let i = 0
		for (const [x, y] of points) {
			if (i !== 0) svgPath += 'L '
			svgPath += `${x} ${y} `
			i++
		}
		return svgPath
	}
	
	const updateSvg = (line) => {
		line.svgPath = genSvgPath(line.points)
	}
	
	const addUndo = () => {
		redosRef.current = [];
		addUndoRaw();
	};
	
	const copyCanvasState = () => {
		return {
			lines: linesRef.current.map(line => {
				return {...line}
			}),
		};
	};
	
	const useCanvasState = (state) => {
		linesRef.current = state.lines;
	};
	
	const addUndoRaw = () => {
		undosRef.current.push(copyCanvasState());
	};
	
	const addRedo = () => {
		redosRef.current.push(copyCanvasState());
	};
	
	const undo = () => {
		const undos = undosRef.current;
		if (undos.length > 0) {
			addRedo();
			
			useCanvasState(undos[undos.length - 1]);
			undos.splice(undos.length - 1, 1);
			renderCanvas(ctxRef.current);
		}
	};
	
	const redo = () => {
		const redos = redosRef.current;
		if (redos.length > 0) {
			addUndoRaw();
			
			useCanvasState(redos[redos.length - 1]);
			redos.splice(redos.length - 1, 1);
			renderCanvas(ctxRef.current);
		}
	};
	
	const clearCanvas = () => {
		addUndo();
		
		const lines = linesRef.current;
		if (lines.length > 0) {
			lines.splice(0, lines.length);
			renderCanvas(ctxRef.current);
		}
	};
	
	const handlePanResponderMove = (event, gestureState) => {
		
		if (selectionActive && selection.current.type === 'lines') {
			
			const diffX = gestureState.dx, diffY = gestureState.dy
			
			selection.current.data.forEach((line, i) => {
				const init = selection.current.init[i]
				
				line.points = init.points.map(([x, y]) => [x + diffX, y + diffY])
				updateSvg(line)
			})
			
			renderCanvas(ctxRef.current)
		}
		
		if (!drawingRef.current) return;
		
		const point = gesturePoint(gestureState)
		
		if (tool === 'line') {
			
			const lines = linesRef.current
			lines[lines.length - 1].points[1] = point
			renderCanvas(ctxRef.current)
			renderNew(ctxRef.current)
			
			return;
		}
		appendPoint(point);
		renderNew(ctxRef.current);
	};
	
	const handlePanResponderGrant = (event, gestureState) => {
		if (gestureState.x0 < sideTabOpenBuffer) {
			setLeftBarActive(true);
		} else if (gestureState.x0 > window.width - sideTabOpenBuffer) {
			setRightBarActive(true);
		} else {
			if (selectionActive) {
				selection.current = {
					...selection.current,
					init: selection.current.data.map(line => {
						return {...line}
					}),
				}
				return;
			}
			
			drawingRef.current = true;
			
			addUndo();
			
			startLine();
			appendPoint(gesturePoint(gestureState));
			renderNew(ctxRef.current);
		}
	};
	
	const handlePanResponderEnd = (event, gestureState) => {
		if (drawingRef.current) {
			drawingRef.current = false;
			analyzeLine();
			
			const lines = linesRef.current;
			const ctx = ctxRef.current;
			
			if (selectionActive) return;
			
			switch (tool) {
				case 'eraser':
				case 'loop': {
					const eraseBy = lastLine(lines);
					const trueLines = exceptLast(lines)
					const selectedMask = tool === 'eraser' ? selectTouching(trueLines, eraseBy) : selectInPoly(trueLines, eraseBy)
					
					let hasSelected = false;
					selectedMask.forEach((val) => {
						if (val) hasSelected = true
					});
					
					if (!hasSelected) {
						undo();
						return;
					}
					
					switch (selectMode) {
						case 'erase': {
							linesRef.current = eraseSelection(trueLines, selectedMask);
							break;
						}
						case 'fill': {
							colorSelected(trueLines, selectedMask, penColor)
							linesRef.current = trueLines
							break;
						}
						case 'move': {
							const selectedLines = []
							selectedMask.forEach((val, i) => {
								if (val) selectedLines.push(trueLines[i])
							})
							selection.current = {
								type: 'lines',
								data: selectedLines
							}
							setSelectionActive((selectedLines.length > 0))
							linesRef.current = trueLines
							break;
						}
						case 'sendBack': {
							const selectedLines = []
							selectedMask.forEach((val, i) => {
								if (val) selectedLines.push(trueLines[i])
							})
							linesRef.current = eraseSelection(trueLines, selectedMask);
							
							selectedLines.forEach(line => {
								linesRef.current.unshift(line);
							})
							break;
						}
						case 'sendFront': {
							const selectedLines = []
							selectedMask.forEach((val, i) => {
								if (val) selectedLines.push(trueLines[i])
							})
							linesRef.current = eraseSelection(trueLines, selectedMask);
							
							selectedLines.forEach(line => {
								linesRef.current.push(line);
							})
							break;
						}
					}
					renderCanvas(ctx);
					
					break;
				}
				case 'pen':
				case 'line': {
					if (smart) {
						let forceRender = false
						
						if (smartSettings.assumeSnip) {
							const snipped = snipIntersections(exceptLast(lines), lastLine(lines));
							if (snipped) {
								updateSvg(lastLine(lines))
								forceRender = true
							}
						}
						
						if (smartSettings.snapEnds && !forceRender) {
							const snapped = smartLineSnapEnds(exceptLast(lines), lastLine(lines));
							if (snapped) {
								updateSvg(lastLine(lines))
								forceRender = true
							}
						}
						
						if (smartSettings.snapSelf && !forceRender) {
							const snapped = smartSnapSelf(lastLine(lines));
							if (snapped) {
								updateSvg(lastLine(lines))
								forceRender = true
							}
						}
						
						if (forceRender) renderCanvas(ctx)
					}
					break;
				}
				
				
			}
		}
	};
	
	const panResponderRef = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onMoveShouldSetPanResponder: () => true,
		onPanResponderGrant: handlePanResponderGrant,
		onPanResponderMove: handlePanResponderMove,
		onPanResponderRelease: handlePanResponderEnd,
		onPanResponderTerminate: () => {
		},
	});
	
	const onSetRigging = (bool) => {
		setRigging(bool)
		if (bool) {
			prevTool.current = tool
			setTool('line')
		} else {
			setTool(prevTool.current)
		}
	}
	
	const onSaveScreenPush = () => {
		
		/*canvasRef.current.toDataURL('image/png').then(res => {
			console.log('YES', res)
			setDataURL(res)
		}).catch(e => console.log('No', e))*/
		
		const newSaves = [...saves]
		newSaves[saveIndex] = {state: copyCanvasState(), undos: [...undosRef.current], redos: [...redosRef.current]}
		setSaves(newSaves)
		
		navigation.navigate('Saves')
	}
	
	const loadSave = (save, newSaveIndex, dimens) => {
		console.log(`loading ${newSaveIndex} (Save ${newSaveIndex + 1})`)
		
		setSaveIndex(newSaveIndex)
		
		undosRef.current = save.undos
		redosRef.current = save.redos
		linesRef.current = save.state.lines;
		
		renderLines(ctxRef.current, save.state.lines, dimens)
	}
	
	const cancelMove = () => {
		setSelectionActive(false)
		undo()
	}
	
	const confirmMove = () => {
		setSelectionActive(false)
		linesRef.current.forEach(line => analyze(line));
	}
	
	return (
		<View
			style={[
				styles.container,
				{borderTopWidth: 2, borderTopColor: theme.sideBarBorder},
			]}
		>
			<View style={{flex: 1, flexDirection: 'row'}}>
				<View
					style={{flex: 1, backgroundColor: theme.canvasBackground}}
					{...panResponderRef.panHandlers}
					onLayout={e => {
						const {width, height} = e.nativeEvent.layout
						setCanvasViewDimens({width, height})
					}}
				>
					<Canvas ref={canvasRef}/>
				</View>
				
				<LeftSideBar
					active={leftBarActive} setActive={setLeftBarActive} tool={tool} setTool={setTool}
					toSettings={() => navigation.navigate('Settings')} toSaves={onSaveScreenPush}
					smart={smart} setSmart={setSmart}
					rigging={rigging} setRigging={onSetRigging}
					lineWidth={lineWidth} setLineWidth={setLineWidth}
					eraserWidth={eraserLineWidth} setEraserWidth={setEraserLineWidth}
					selectMode={selectMode} setSelectMode={setSelectMode}
				/>
				<RightSideBar
					active={rightBarActive} setActive={setRightBarActive}
					color={penColor} setColor={setPenColor} leftActive={leftBarActive}/>
			</View>
			
			<UndoRedoBar undo={undo} clearCanvas={clearCanvas} redo={redo}
			             selectionActive={selectionActive} cancelMove={cancelMove} confirmMove={confirmMove}/>
		</View>
	);
};
export default DrawScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	text: {
		color: 'black',
		fontSize: 40,
	},
});
