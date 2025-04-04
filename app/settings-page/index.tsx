import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import SettingItems from '~/components/profile/settingsItems'

const Settings = () => {
     const router = useRouter()
  return (
    <View className='p-4'>
      {/* top nav */}
      <View className="flex items-center justify-between flex-row p-1">
      <TouchableOpacity
      onPress={()=>router.back()}
      className="justify-center flex items-center border p-3 rounded-full border-gray-400">
       <Image source={require('./../../assets/back1.png')} style={{ width: 20, height: 20 }} />
       </TouchableOpacity>
        <Text className='font-popSb text-2xl text-green-1 flex-1 text-center'>My Profile</Text>
      </View>
      {/* Reminder */}
      <SettingItems/>

    </View>
  )
}

export default Settings