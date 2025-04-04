import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getLocalStorage } from '~/service/Storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '~/utils/firebase';

const Header = () => {
  const [user, setUser] = useState<{ displayName?: string } | null>(null);
  const router = useRouter()

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

    const handleLogout = async () => {
      try {
        await signOut(auth);
        setUser(null); // Ensure re-render
        router.replace('/login'); // Redirect after logout
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

  return (
    <View className='mt-2 mb-4'>
      <View className='flex flex-row items-center justify-between'>
        <View className='flex flex-row gap-2 items-center border p-1 border-gray-300 rounded-full'>
        <Image source={require('./../../assets/me.jpg')} style={{ width: 35, height: 35 }} className='rounded-full' />
        <Text className='text-2xl capitalize font-popSb text-green-1'>Hello {user?.displayName || 'Guest'} 👋</Text>
        </View>
        <TouchableOpacity 
          onPress={()=>router.back()}
          className="justify-center flex items-center border p-3 rounded-full border-gray-400">
          <Image source={require('./../../assets/bell.png')} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
