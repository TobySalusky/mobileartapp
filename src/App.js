import "react-native-gesture-handler";
import React from "react";
import GlobalProvider from "./context/GlobalProvider";
import DrawScreen from "./screens/DrawScreen";

const App = () => {

	return (
		<GlobalProvider>
			<DrawScreen/>
		</GlobalProvider>
	);
}
export default App;
