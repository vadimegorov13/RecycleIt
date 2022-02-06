import React from "react";

import WelcomeScreen from "./app/screens/WelcomeScreen";
import CameraScreen from "./app/screens/CameraScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RecycleIT">
        <Stack.Screen name="RecycleIT" component={WelcomeScreen} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
