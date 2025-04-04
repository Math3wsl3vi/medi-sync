import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const listItems = [
    {
        imageUrl: require('./../../assets/volume.png'),
        name: 'Volume And Vibration',
      },
      {
        imageUrl: require('./../../assets/mute.png'),
        name: 'Mute',
      },
      {
        imageUrl: require('./../../assets/music.png'),
        name: 'Ringtone',
      },
      {
        imageUrl: require('./../../assets/notificaiton.png'),
        name: 'Disable Notifications',
      },
]

const generalList = [
    {
        imageUrl: require('./../../assets/theme.png'),
        name: 'Theme',
      },
      {
        imageUrl: require('./../../assets/language.png'),
        name: 'Language',
      },
      {
        imageUrl: require('./../../assets/logout.png'),
        name: 'Logout',
      },
      {
        imageUrl: require('./../../assets/delete.png'),
        name: 'Delete Account',
      },
]


const SettingItems = () => {
  return (
    <View>
    <View className='mt-5'>
        <Text className='text-2xl mb-5 font-popSb '>Reminder</Text>
        <FlatList
       data={listItems}
       keyExtractor={(item, index) => index.toString()}
       renderItem={({item})=> (
        <View className='border border-gray-300 rounded-full mb-5 p-2 h-20 flex flex-row items-center justify-between gap-2 w-full'>
            <View className='flex flex-row  items-center justify-center gap-2'>
            <View className='border border-gray-300 p-1 rounded-full'>
            <Image source={item.imageUrl} className='h-8 w-8 rounded-full' style={{tintColor:'#4B5563'}}/>
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
       {/* general */}
       <View className='mt-5'>
        <Text className='text-2xl mb-5 font-popSb '>General</Text>
        <FlatList
            data={generalList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View className='border border-gray-300 rounded-full mb-5 p-2 h-20 flex flex-row items-center justify-between gap-2 w-full'>
                <View className='flex flex-row items-center justify-center gap-2'>
                    <View className='border border-gray-300 p-1 rounded-full'>
                    <Image source={item.imageUrl} className='h-8 w-8 rounded-full' style={{ tintColor: '#4B5563' }} />
                    </View>
                    <Text
                    className={`font-popSb text-xl ${item.name === 'Delete Account' ? 'text-red-600' : 'text-green-1'}`}
                    >
                    {item.name}
                    </Text>
                </View>
                <View>
                    <TouchableOpacity className='border border-gray-300 rounded-full p-2 flex items-center justify-center'>
                    <Image source={require('./../../assets/next.png')} style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                </View>
                </View>
            )}
            />

       </View>
       </View>
  )
}

export default SettingItems