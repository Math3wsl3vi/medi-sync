import { useState, useEffect } from 'react';
import { Redirect, Stack, useRouter } from 'expo-router';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '~/components/Button';
import Header from '~/components/home/Header';
import { auth } from '~/utils/firebase';
import { removeLocalStorage } from '~/service/Storage';
import EmptyMedication from '~/components/home/EmptyMedication';
import MedicationList from '~/components/home/MedicationList';

export default function Home() {
  const [user, setUser] = useState(auth.currentUser);
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
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

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <ScrollView className='bg-white h-full p-5'>
      <Header />
      {/* <Button title='logout' onPress={async () => {
        await signOut(auth);
        await removeLocalStorage(); 
      }} /> */}
      {/* <EmptyMedication/> */}
      <MedicationList/>
    </ScrollView>
  );
}
