import "react-native-gesture-handler";
import React from "react";
import GlobalProvider from "./src/context/GlobalProvider";
import RouteManager from "./src/screens/RouteManager";
import * as ScreenOrientation from 'expo-screen-orientation';

const App = () => {
	
	React.useEffect(() => {
		setOrientation()
	}, [])
	
	async function setOrientation() {
		await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP); // TODO: either get this working properly or add support for landscape
	}
	
	return (
		<GlobalProvider>
			<RouteManager/>
		</GlobalProvider>
	);
}
export default App;
