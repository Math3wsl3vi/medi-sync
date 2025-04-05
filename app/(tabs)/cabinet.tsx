import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import EmptyMedication from '~/components/home/EmptyMedication'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { Image } from 'react-native'
import ChartData from '~/components/cabinet/ChartData'
import StreakData from '~/components/cabinet/StreakData'

const Cabinet = () => {
  const router = useRouter()
  return (
    <View className='p-4 bg-white h-full flex gap-5'>
      {/* top part nav */}
      <View className="flex items-center justify-between flex-row">
      <TouchableOpacity 
      onPress={()=>router.back()}
      className="justify-center flex items-center border p-3 rounded-full border-gray-400">
      <Image source={require('./../../assets/back1.png')} style={{ width: 20, height: 20 }} />
       </TouchableOpacity>
        <Text className='font-popSb text-2xl text-green-1'>My Records</Text>
        <TouchableOpacity
        onPress={()=>router.push('/settings-page')}
        className="justify-end border p-2 rounded-full border-gray-400">
          <Ionicons name="settings-outline" size={25} color="black" />
        </TouchableOpacity>
      </View>
      {/* pie data chart */}
      <ChartData/>
      {/* streak data */}
      <StreakData/>
    </View>
  )
}

export default Cabinet