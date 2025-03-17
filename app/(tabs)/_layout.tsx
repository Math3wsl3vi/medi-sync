import { Link, Tabs, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useState } from 'react';
import { getLocalStorage } from '~/service/Storage';

export default function TabLayout() {
  const router = useRouter()
  useEffect(()=> {
    getUserDetail();
  },[])
  const getUserDetail =async ()=> {
    const userInfo = await getLocalStorage('userDetail')
    getLocalStorage('userDetail').then(data => console.log("Retrieved user:", data));
    if(!userInfo){
      router.replace('/login')
    }
  }
 
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        headerShown:false
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="cabinet"
        options={{
          title: 'Medication',
          tabBarIcon: ({ color }) => <MaterialIcons name="medication" size={24} color="black" />,
        }}
      />
       <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}
