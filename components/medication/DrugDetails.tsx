import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const DrugDetails = () => {

    const { name, dosage, frequency, duration } = useLocalSearchParams()
  return (
    <View>
        {/* drug detail */}
        <View className='flex flex-col gap-5 items-center justify-center mt-4 mx-10  '>
            <View className='border rounded-full p-2 h-20 w-20 flex items-center justify-center mt-10'>
            <Image source={require('./../../assets/pillNew.png')} className='w-10 h-10'/>
            </View>
            <Text className='font-pop text-lg'>7:00 AM Daily</Text>
            <Text className='font-popSb text-2xl text-green-1 capitalize'>{name}</Text>
            <Text className='font-pop text-lg'>Also know as {name}</Text>
            <View className='flex flex-row justify-center gap-5 mt-10'>
                <Text className='text-xl font-pop'>{dosage}</Text>
                <Text className='text-xl font-pop'>{frequency} times a day</Text>
            </View>
            <View className='flex flex-row justify-between items-center gap-2.5 mt-10  w-full'>
            <View className='flex flex-col gap-3 items-center justify-center  w-28'>
            <View className='border rounded-full p-3 flex items-center justify-center border-gray-300'>
            <Image source={require('./../../assets/check1.png')} className='w-8 h-8'/>
            </View>
            <Text className='font-popSb text-xl text-green-1'>Taken</Text>
            </View>
            <View className='flex flex-col gap-3 items-center justify-center  w-28'>
            <View className='border rounded-full p-3 flex items-center justify-center border-gray-300'>
            <Image source={require('./../../assets/editing.png')} className='w-8 h-8'/>
            </View>
            <Text className='font-popSb text-xl text-green-1'>Edit Times</Text>
            </View>
            <View className='flex flex-col gap-3 items-center justify-center  w-28'>
            <View className='border rounded-full p-3 flex items-center justify-center border-gray-300'>
            <Image source={require('./../../assets/calendar.png')} className='w-8 h-8'/>
            </View>
            <Text className='font-popSb text-xl text-green-1'>Reschedule</Text>
            </View>
            </View>
        </View>
        {/* more info details */}
        <TouchableOpacity className='bg-green-1 px-4 py-3 mt-[60px] rounded-xl flex flex-row items-center gap-2 justify-center'>
            <Text className='font-pop text-xl text-white capitalize'>More About {name}</Text>
            <Image source={require('./../../assets/link.png')} style={{tintColor:'white'}} className='w-6 h-6'/>
        </TouchableOpacity>
        
        {/* delete */}
        <TouchableOpacity className='bg-red-600 px-4 py-3 mt-10 rounded-xl flex flex-row items-center gap-2 justify-center'>
            <Text className='font-pop text-xl text-white'>Delete From Schedule</Text>
            <Image source={require('./../../assets/delete.png')} style={{tintColor:'white'}} className='w-6 h-6'/>
        </TouchableOpacity>
    </View>
  )
}

export default DrugDetails