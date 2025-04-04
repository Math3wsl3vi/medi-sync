import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import DrugDetails from '~/components/medication/DrugDetails'

const index = () => {
    const router = useRouter()
  return (
    <View className='bg-white h-screen p-4'>
     {/* topNav */}
     <View className="flex items-center justify-between flex-row">
      <TouchableOpacity 
      onPress={()=>router.back()}
      className="justify-center flex items-center border p-3 rounded-full border-gray-400">
      <Image source={require('./../../assets/back1.png')} style={{ width: 20, height: 20 }} />
       </TouchableOpacity>
        <Text className='font-popSb text-2xl text-green-1'>Medication Details</Text>
        <TouchableOpacity
        onPress={()=>router.push('/settings-page')}
        className="justify-end border p-2 rounded-full border-gray-400">
          <Ionicons name="settings-outline" size={25} color="black" />
        </TouchableOpacity>
      </View>
     {/* Mediaction detail */}
     <DrugDetails/>

    </View>
  )
}

export default index