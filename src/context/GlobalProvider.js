import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { DataURLProvider } from './DataURLContext';


const GlobalProvider = ({children}) => {
	
	return (
		<DataURLProvider>
			<ThemeProvider>
				{children}
			</ThemeProvider>
		</DataURLProvider>
	);
	
}
export default GlobalProvider
