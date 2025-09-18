import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedScreen from "../screens/Feed/FeedScreen";
import CommunityListScreen from "../screens/Community/CommunityListScreen";
import ProfileScreen from "../screens/Auth/ProfileScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";

export type AppStackParamList = {
  Feed: undefined;
  Communities: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Feed">
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="Communities" component={CommunityListScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
