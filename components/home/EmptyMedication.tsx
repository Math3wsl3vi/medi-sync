import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const EmptyMedication = () => {
  return (
    <View>
        <Image source={require('./../../assets/find.png')} className='w-full h-[500px]'/>
      <Text className='font-bold text-[40px] mt-5 text-green-1'>No Medications Here Yet.</Text>
      <Text className='text-xl font-semibold text-gray-500 text-center'>Kindly Add new medication.</Text>

      <TouchableOpacity className='py-3 px-4 rounded-md bg-green-1 mt-5'>
        <Text className='text-center text-white text-xl'>Add New Medication</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EmptyMedication