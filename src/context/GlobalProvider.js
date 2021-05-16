import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { DataURLProvider } from './DataURLContext';
import { SmartSettingsProvider } from './SmartSettingsContext';
import { CanvasDimensProvider } from './CanvasDimensContext';
import { SavesProvider } from './SavesContext';
import { ApplySaveProvider } from './ApplySaveContext';

const GlobalProvider = ({children}) => {
	
	return (
		<DataURLProvider>
			<ThemeProvider>
				<SmartSettingsProvider>
					<CanvasDimensProvider>
						<SavesProvider>
							<ApplySaveProvider>
								{children}
							</ApplySaveProvider>
						</SavesProvider>
					</CanvasDimensProvider>
				</SmartSettingsProvider>
			</ThemeProvider>
		</DataURLProvider>
	);
	
}
export default GlobalProvider
