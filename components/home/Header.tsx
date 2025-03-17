import { View, Text, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getLocalStorage } from '~/service/Storage';
import Ionicons from '@expo/vector-icons/Ionicons';

const Header = () => {
  const [user, setUser] = useState<{ displayName?: string } | null>(null);

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const userInfo = await getLocalStorage('userDetail');
        console.log('Retrieved user:', userInfo);
        if (userInfo) {
          setUser(userInfo); 
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    getUserDetail();
  }, []); 

  return (
    <View className='mt-5'>
      <View className='flex flex-row items-center justify-between'>
        <View className='flex flex-row gap-5 items-center'>
        <Image source={require('./../../assets/logo.png')} style={{ width: 30, height: 30 }} />
        <Text className='text-2xl'>Hello {user?.displayName || 'Guest'} 👋</Text>
        </View>
        <View className='justify-end'>
        <Ionicons name="settings" size={24} color="black" />
        </View>
      </View>
    </View>
  );
};

export default Header;
