import React from "react";
import {lightTheme, darkTheme} from "../Themes";

export const ThemeContext = React.createContext();

export const ThemeProvider = (props) => {
    const [theme, setTheme] = React.useState(darkTheme)

    return <ThemeContext.Provider value={[theme, setTheme]}>{props.children}</ThemeContext.Provider>;
}
