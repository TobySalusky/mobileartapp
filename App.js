import "react-native-gesture-handler";
import React from "react";
import GlobalProvider from "./src/context/GlobalProvider";
import DrawScreen from "./src/screens/DrawScreen";

const App = () => {

  return (
      <GlobalProvider>
        <DrawScreen/>
      </GlobalProvider>
  );
}
export default App;
