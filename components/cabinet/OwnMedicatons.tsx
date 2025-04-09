import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const OwnMedicatons = () => {
    const router = useRouter()
  return (
   <View className='w-full flex flex-col gap-5 bg-green-50 rounded-xl mb-4 p-4'>
    <Text className='font-popSb text-xl text-gray-500'>Have Your Own Medications?</Text>       
    <Text className='font-pop text-xl'>You can set Custom reminders for your other medications or vitamins.</Text>
     <TouchableOpacity 
          onPress={()=> router.push('/add-new-medication')}
          className='py-3 px-4 rounded-md bg-green-1 mt-5'>
            <Text className='text-center text-white text-xl font-pop'>Add New Medication</Text>
          </TouchableOpacity>
    </View>
  )
}

export default OwnMedicatons