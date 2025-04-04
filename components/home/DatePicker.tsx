import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import dayjs from "dayjs";

const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().date());

  // Generate 7 days from today
  const dates = Array.from({ length: 7 }).map((_, index) => {
    const date = dayjs().add(index, "day");
    return {
      day: date.format("ddd"), 
      date: date.date(), 
    };
  });

  return (
    <View className="mt-1">
      <FlatList
        data={dates}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => {
          const isSelected = item.date === selectedDate;
          return (
            <TouchableOpacity
              onPress={() => setSelectedDate(item.date)}
              className={`w-14 h-16 rounded-2xl flex items-center justify-center border ${
                isSelected ? "bg-green-100 border-green-500" : "border-gray-300"
              }`}
            >
              <Text className="text-lg font-popSb">{item.date}</Text>
              <Text className="text-gray-500 font-pop">{item.day}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default DatePicker;
