import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import { AnimatedCircularProgress } from "react-native-circular-progress";

const ChartData = () => {
    const progress = 60;
  return (
    <View className='w-full rounded-xl bg-green-50 min-h-44 mt-4 p-2'>
        <View className='flex flex-row justify-between items-center'>
        <Text className='text-xl font-popSb mb-5 mt-3'>Medications Data</Text>
        <View className="justify-end p-2 rounded-full bg-white">
        <Entypo name="dots-three-vertical" size={20} color="black" />
        </View>
        </View>
        <View className='items-center'>
            {/* Semi-circle progress gauge */}
        <AnimatedCircularProgress
          size={200} // Diameter of the circle
          width={30} // Thickness of the progress ring
          fill={progress} // Percentage (0-100)
          tintColor="#22b73a" // Progress color (green to match your app theme)
          backgroundColor="#d3d3d3" // Background color of the ring
          rotation={-90} // Rotate to make it a semi-circle (starts at top)
          arcSweepAngle={180} // 180 degrees for a semi-circle
          lineCap="butt" // Rounded ends
        >
          {() => (
            <Text className="text-xl font-semibold text-gray-600">
              Yesterday: {progress}%
            </Text>
          )}
        </AnimatedCircularProgress>
      </View>
      {/* View All Logs Button */}
      <TouchableOpacity className="mt-4 bg-gray-200 p-2 rounded-lg items-center">
        <Text className="text-gray-700 font-semibold">View</Text>
      </TouchableOpacity>
        </View>
  )
}

export default ChartData