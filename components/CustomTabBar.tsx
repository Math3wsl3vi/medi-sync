import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View className="bg-white">
    <View className="flex-row justify-around items-center bg-white px-3 py-4 rounded-full shadow-lg mx-4 mb-2">
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        
        let iconName: keyof typeof Ionicons.glyphMap = "home";
        if (route.name === "cabinet") iconName = "medkit";
        else if (route.name === "profile") iconName = "person";
        // else iconName = 'medkit'

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="flex items-center"
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isFocused ? "#22c55e" : "#999"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
    </View>
  );
}
