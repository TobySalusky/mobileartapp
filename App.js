import "react-native-gesture-handler";
import React from "react";
import GlobalProvider from "./src/context/GlobalProvider";
import RouteManager from "./src/screens/RouteManager";

const App = () => {

  return (
      <GlobalProvider>
          <RouteManager/>
      </GlobalProvider>
  );
}
export default App;
