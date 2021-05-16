import React from 'react';

export const CanvasDimensContext = React.createContext();

export const CanvasDimensProvider = (props) => {
	const [canvasViewDimens, setCanvasViewDimens] = React.useState({width: 0, height: 0})
	
	return <CanvasDimensContext.Provider
		value={[canvasViewDimens, setCanvasViewDimens]}>{props.children}</CanvasDimensContext.Provider>;
}