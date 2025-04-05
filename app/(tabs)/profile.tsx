import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import ProfileHeader from '~/components/profile/ProfileHeader'
import ItemCards from '~/components/profile/ItemCards'
import ProfileListItems from '~/components/profile/ProfileListItems'

const profile = () => {
  return (
    <ScrollView className='pt-5 bg-white h-screen p-4'>
      <ProfileHeader/>
      <ItemCards/>
      <ProfileListItems/>
      <View className='h-[30px]'></View>
    </ScrollView>
  )
}

export default profile