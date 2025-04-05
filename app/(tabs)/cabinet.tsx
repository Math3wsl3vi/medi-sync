import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import EmptyMedication from '~/components/home/EmptyMedication'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { Image } from 'react-native'
import ChartData from '~/components/cabinet/ChartData'
import StreakData from '~/components/cabinet/StreakData'
import CurrentMedications from '~/components/cabinet/CurrentMedications'

const Cabinet = () => {
  const router = useRouter()
  return (
    <ScrollView className='p-4 bg-white h-screen flex gap-5'>
      {/* top part nav */}
      <View className="flex items-center justify-between flex-row mb-10">
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
      <CurrentMedications/>
      {/* pie data chart */}
      <ChartData/>
      {/* streak data */}
      <StreakData/>
      <View className='h-[30px]'></View>
    </ScrollView>
  )
}

export default Cabinet