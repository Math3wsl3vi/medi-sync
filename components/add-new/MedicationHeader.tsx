import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';

const MedicationHeader = () => {
    const router = useRouter()
  return (
    <View className='relative'>
     <Image source={require('./../../assets/medication.png')} className='w-full h-[300px]'/>
     <TouchableOpacity 
     onPress={()=>router.back()}
     className='absolute m-4'>
     <AntDesign name="arrowleft" size={30} color="black" />
     </TouchableOpacity>
    </View>
  )
}

export default MedicationHeader