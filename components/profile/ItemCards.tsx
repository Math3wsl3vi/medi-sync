import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'

const Items = [
    {
        imageUrl: require('./../../assets/capsules.png'),
        name: 'Meds',
      },
      {
        imageUrl: require('./../../assets/clock.png'),
        name: 'History',
      },
      {
        imageUrl: require('./../../assets/check.png'),
        name: 'Progress',
      },
      {
        imageUrl: require('./../../assets/diet.png'),
        name: 'Allergies',
      },
]

const ItemCards = () => {
  return (
   <View className='mt-5'>
    <FlatList
   data={Items}
   keyExtractor={(item, index) => index.toString()}
   horizontal
   renderItem={({item})=> (
    <View className='bg-green-50 rounded-xl mr-5 p-2 w-24 h-24 flex items-center justify-center gap-2'>
        <View className=''>
        <Image source={item.imageUrl} className='h-10 w-10 rounded-full' style={{tintColor:'#4B5563'}}/>
        </View>
        <Text className='font-pop'>{item.name}</Text>
    </View>
   )}
   />
   </View>
  )
}

export default ItemCards