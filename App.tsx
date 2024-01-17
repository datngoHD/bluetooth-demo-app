import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "./Dashboard";
import DeviceConnect from "./DeviceConnect";
import { LogBox } from "react-native";
import ListCharacter from "./ListCharacter";
LogBox.ignoreLogs(["new NativeEventEmitter"]);
LogBox.ignoreLogs(["Possible Unhandled Promise Rejection"]);
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="DeviceConnect" component={DeviceConnect} />
        <Stack.Screen name="ListCharacter" component={ListCharacter} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
