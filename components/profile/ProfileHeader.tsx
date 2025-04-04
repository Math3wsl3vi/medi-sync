import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import ItemCards from './ItemCards';
import { useRouter } from 'expo-router';

const ProfileHeader = () => {

    const router = useRouter()
  return (
    <View className='p-1'>
      {/* icons */}
      <View className="flex items-center justify-between flex-row">
      <TouchableOpacity className="justify-center flex items-center border p-2 rounded-full border-gray-400">
       <Image source={require('./../../assets/back.png')} style={{ width: 25, height: 25 }} />
       </TouchableOpacity>
        <Text className='font-popSb text-2xl text-green-1'>My Profile</Text>
        <TouchableOpacity
        onPress={()=>router.push('/settings-page')}
        className="justify-end border p-2 rounded-full border-gray-400">
          <Ionicons name="settings-outline" size={25} color="black" />
        </TouchableOpacity>
      </View>
      {/* image */}
      <View className='flex items-center justify-center mt-5'>
     <TouchableOpacity className='border-2 p-1.5 rounded-full border-green-1'>
     <Image source={require('./../../assets/me.jpg')} style={{ width: 120, height: 120 }} className='rounded-full'/>
     </TouchableOpacity>
     <TouchableOpacity className='rounded-full bg-green-50 flex flex-row gap-3 w-1/3 items-center h-11 p-1 -mt-4'>
     <View className='rounded-full p-2 bg-green-1'>
     <Image source={require('./../../assets/editing.png')} style={{ width: 20, height: 20, tintColor:'white' }} />
     </View>
     <Text className='font-popSb text-lg text-gray-500'>Edit Profile</Text>
     </TouchableOpacity>
      </View>
      <View>

      </View>
    </View>
  );
};

export default ProfileHeader;
