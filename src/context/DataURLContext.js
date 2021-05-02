import React from 'react';

export const DataURLContext = React.createContext();

export const DataURLProvider = (props) => {
	const [dataURL, setDataURL] = React.useState(null)
	
	return <DataURLContext.Provider value={[dataURL, setDataURL]}>{props.children}</DataURLContext.Provider>;
}
