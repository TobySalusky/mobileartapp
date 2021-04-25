import React from "react";
import { ThemeProvider } from "./ThemeContext";


const GlobalProvider = ({children}) => {

	return (
		<ThemeProvider>
			{children}
		</ThemeProvider>
	);

}
export default GlobalProvider
