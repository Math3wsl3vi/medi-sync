import { View, Text } from 'react-native'
import React from 'react'
import DatePicker from './DatePicker'
import MedicationComponent from './MedicationComponent'

const MedicationDays = () => {
  return (
    <View className='mt-4'>
      <Text className='font-popSb text-2xl mb-5'>Your Schedule</Text>
      <View>
        <DatePicker/>
      </View>
      <MedicationComponent/>
    </View>
  )
}

export default MedicationDays