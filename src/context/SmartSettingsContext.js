import React from "react";

export const SmartSettingsContext = React.createContext();

export const SmartSettingsProvider = (props) => {
	const [smartSettings, setSmartSettings] = React.useState({
		snapEnds: true,
		snapSelf: true,
		assumeSnip: true,
	})
	
	return <SmartSettingsContext.Provider
		value={[smartSettings, setSmartSettings]}>{props.children}</SmartSettingsContext.Provider>;
}
