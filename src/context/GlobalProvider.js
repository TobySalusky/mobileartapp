import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { DataURLProvider } from './DataURLContext';
import { SmartSettingsProvider } from "./SmartSettingsContext";

const GlobalProvider = ({children}) => {
	
	return (
		<DataURLProvider>
			<ThemeProvider>
				<SmartSettingsProvider>
					{children}
				</SmartSettingsProvider>
			</ThemeProvider>
		</DataURLProvider>
	);
	
}
export default GlobalProvider
