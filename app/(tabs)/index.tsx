import { useState, useEffect } from 'react';
import { Redirect, Stack, useRouter } from 'expo-router';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '~/components/Button';
import Header from '~/components/home/Header';
import { auth } from '~/utils/firebase';
import MedicationDays from '~/components/home/MedicationDays';

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
      <View>
           <Image 
            source={require('./../../assets/pharm.png')} 
            style={{ width: 300, height: 200, marginBottom: 10 }}
            resizeMode="contain"
            className="mb-5"
        />
      </View>
      <MedicationDays/>
    </ScrollView>
  );
}
