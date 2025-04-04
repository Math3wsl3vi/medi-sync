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
        <View className='flex flex-row gap-5 items-center'>
        <Image source={require('./../../assets/logo.png')} style={{ width: 30, height: 30 }} />
        <Text className='text-2xl capitalize font-popSb text-green-1'>Hello {user?.displayName || 'Guest'} 👋</Text>
        </View>
        <TouchableOpacity 
        onPress={handleLogout}
        className='justify-end'>
        <Ionicons name="settings-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
