import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';

const listItems = [
      {
        imageUrl: require('./../../assets/clock1.png'),
        name: 'Set Custom Reminders',
      },
      {
        imageUrl: require('./../../assets/clock1.png'),
        name: 'Set Custom Time',
      },
     {
        imageUrl: require('./../../assets/old.png'),
        name: 'Caregiver Mode',
      },
      {
        imageUrl: require('./../../assets/info.png'),
        name: 'Add Personal Information',
      },
      {
        imageUrl: require('./../../assets/achieve.png'),
        name: 'Badges',
      },
      {
        imageUrl: require('./../../assets/fire.png'),
        name: 'Streaks',
      },
]


const ProfileListItems = () => {
  return (
    <View className='mt-5'>
        <FlatList
       data={listItems}
       keyExtractor={(item, index) => index.toString()}
       renderItem={({item})=> (
        <View className='border border-gray-300 rounded-full mb-5 p-2 h-20 flex flex-row items-center justify-between gap-2 w-full'>
            <View className='flex flex-row  items-center justify-center gap-2'>
            <View className='border border-gray-300 p-1 rounded-full'>
            <Image source={item.imageUrl} className='h-10 w-10 rounded-full' style={{tintColor:'#4B5563'}}/>
            </View>
            <Text className='font-popSb text-green-1 text-xl'>{item.name}</Text>
            </View>
            <View>
            <TouchableOpacity className='border border-gray-300 rounded-full p-2 flex items-center justify-center'>
            <Image source={require('./../../assets/next.png')} style={{ width: 25, height: 25 }} />
            </TouchableOpacity >
            </View>
        </View>
       )}
       />
       </View>
  )
}

export default ProfileListItems