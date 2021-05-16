import React from 'react';

export const SavesContext = React.createContext();

export const SavesProvider = (props) => {
	const [saves, setSaves] = React.useState([])
	
	return <SavesContext.Provider value={[saves, setSaves]}>{props.children}</SavesContext.Provider>;
}
