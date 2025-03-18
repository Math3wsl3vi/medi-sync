import { View, Text } from 'react-native'
import React from 'react'
import EmptyMedication from '~/components/home/EmptyMedication'

const Cabinet = () => {
  return (
    <View className='p-4 bg-white h-full'>
     <EmptyMedication/>
    </View>
  )
}

export default Cabinet