import { View, Text, Image } from 'react-native'
import React from 'react'

const CurrentMedications = () => {
  return (
    <View className='w-full flex flex-col gap-5 bg-green-50 rounded-xl'>
         <Text className='text-xl font-popSb m-4'>Recent Medications</Text>
        <View className='flex flex-row items-center justify-between gap-5 w-full p-4'>
           <View className='flex flex-col gap-4 w-[40%]  bg-green-100 p-2 rounded-md h-32'>
           <View className='flex items-center justify-center bg-white rounded-full p-1 h-10 w-10'>
           <Image source={require('./../../assets/fire.png')} style={{ width: 10, height: 10 }} />
           </View>
               <View>
                 <Text className='text-lg font-popSb'>0 Days</Text>
                 <Text className='text-sm font-pop'>Current Streak</Text>
               </View>
           </View>
   
           <View className='flex flex-col gap-4 w-[40%]  bg-green-100 p-2 rounded-md h-32'>
           <View className='flex items-center justify-center bg-white rounded-full p-1 w-10 h-10'>
           <Image source={require('./../../assets/fire.png')} style={{ width: 10, height: 10 }} />
           </View>
               <View>
                 <Text className='text-lg font-popSb'>0 Days</Text>
                 <Text className='text-sm font-pop'>Current Streak</Text>
               </View>
           </View>
        </View>
       </View>
  )
}

export default CurrentMedications