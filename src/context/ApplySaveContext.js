import React from 'react';

export const ApplySaveContext = React.createContext();

export const ApplySaveProvider = (props) => {
	const [applySave, setApplySave] = React.useState(null)
	
	return <ApplySaveContext.Provider value={[applySave, setApplySave]}>{props.children}</ApplySaveContext.Provider>;
}
