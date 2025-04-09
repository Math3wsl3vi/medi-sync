import { View, Text, Image } from 'react-native'
import React from 'react'
import MedicationComponent from '../home/MedicationComponent'

const CurrentMedications = () => {
  return (
    <View className='w-full flex flex-col gap-5 bg-green-50 rounded-xl'>
         <Text className='text-xl font-popSb m-4'>Recent Medications</Text>
       </View>
  )
}

export default CurrentMedications