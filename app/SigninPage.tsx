import { View, Text, TextInput, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '~/utils/firebase';
import { setLocalStorage } from '~/service/Storage';
import { FirebaseError } from 'firebase/app';


const SigninPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isChecked, setChecked] = useState(false);
    const router = useRouter();
  
    // Function to handle user login
    const onSignIn = async () => {
      if (!email || !password || !name) {
        ToastAndroid.show('Please enter all details.', ToastAndroid.BOTTOM);
        return;
      }
    
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        // Directly update the user obtained from userCredential
        await updateProfile(user, { displayName: name });
    
        // Reload user before setting to local storage
        await user.reload();
    
        await setLocalStorage('userDetail', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || name,  
        });
    
        console.log(user); // Debugging
        ToastAndroid.show('Welcome to MediSync', ToastAndroid.BOTTOM);
        router.push('/(tabs)');
      } catch (error) {
        if (error instanceof FirebaseError) {
          if (error.code === 'auth/email-already-in-use') {
            ToastAndroid.show('Email already in use. Login.', ToastAndroid.BOTTOM);
          }
        } else {
          console.error(error);
          ToastAndroid.show('Something went wrong. Try again.', ToastAndroid.BOTTOM);
        }
      }
    };
    
  return (
    <View className='flex-1 items-center justify-center bg-gray-100 p-4'>
      {/* Form Container */}
      <View className='bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md'>
        <Text className='text-2xl font-bold text-center mb-1 font-popSb'>Welcome to MediSync</Text>
        <Text className='text-center text-gray-500 mb-6 font-semibold font-pop'>Let's Sign You In</Text>

        {/* Name Input */}
        <View className='mb-4'>
          <Text className='text-lg font-semibold mb-1 font-popSb'>Name</Text>
          <TextInput 
            placeholder='Name' 
            className='border rounded-md p-3 border-gray-300' 
            keyboardType='email-address' 
            value={name}
            onChangeText={setName}
                    />
        </View>

        {/* Email Input */}
        <View className='mb-4'>
          <Text className='text-lg font-semibold mb-1 font-popSb'>Email</Text>
          <TextInput 
                placeholder='Email' 
                className='border rounded-md p-3 border-gray-300' 
                keyboardType='email-address' 
                value={email}
                onChangeText={setEmail}
            />
        </View>

        {/* Password Input with Toggle */}
        <View className='mb-6'>
          <Text className='text-lg font-semibold mb-1 font-popSb'>Password</Text>
          <View className='flex-row items-center border rounded-md px-3 border-gray-300'>
            <TextInput
              placeholder='Password'
              className='flex-1'
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              autoCapitalize='none'
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Text className='text-gray-500'>{passwordVisible ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity className='bg-green-1 p-3 rounded-md' onPress={onSignIn}>
          <Text className='text-white text-center text-lg font-bold font-popSb'>Sign Up</Text>
        </TouchableOpacity>

        {/* Login Redirect */}
        <Text className='text-center text-gray-500 mt-4 text-xl font-pop'>
          Already have an account? <TouchableOpacity onPress={()=>router.push('/sign-up')}><Text className='text-black font-semibold text-xl font-popSb'>Login</Text></TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

export default SigninPage;
