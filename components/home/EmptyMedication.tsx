import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const EmptyMedication = () => {
  const router = useRouter()
  return (
    <View>
        <Image source={require('./../../assets/find.png')} className='w-full h-[500px]'/>
      <Text className='text-[40px] mt-5 text-green-1 font-popB'>No Medications Here Yet.</Text>
      <Text className='text-xl text-gray-500 text-center font-popSb'>Kindly Add new medication.</Text>

      <TouchableOpacity 
      onPress={()=> router.push('/add-new-medication')}
      className='py-3 px-4 rounded-md bg-green-1 mt-5'>
        <Text className='text-center text-white text-xl font-pop'>Add New Medication</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EmptyMedication