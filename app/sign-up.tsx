import { View, Text, TextInput, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '~/utils/firebase';
import { setLocalStorage } from './../service/Storage'


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const router = useRouter();

  // Function to handle user login
  const onSignIn = async () => {
    if (!email || !password) {
      ToastAndroid.show('Please enter both email and password.', ToastAndroid.SHORT);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
    .then(async(userCredential) => {
      // Signed in 
      const user = userCredential.user;
      ToastAndroid.show('Welcome Back',ToastAndroid.BOTTOM)
      // Alert.alert('Welcome Back')
      console.log(user)
      await setLocalStorage('userDetail', user)
      router.replace('/(tabs)')
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error)
    if(errorCode =='auht/invalid-credentials'){
      ToastAndroid.show('Invalid Credentials', ToastAndroid.BOTTOM)
    }

    });
  };

  return (
    <View className='flex-1 items-center justify-center bg-gray-100 p-4'>
      {/* Form Container */}
      <View className='bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md'>
        <Text className='text-2xl font-bold text-center mb-1'>Welcome Back to MediSync</Text>
        <Text className='text-center text-gray-500 mb-6 font-semibold'>Login to Continue</Text>

        {/* Email Input */}
        <View className='mb-4'>
          <Text className='text-lg font-semibold mb-1'>Email</Text>
          <TextInput 
            placeholder='Email' 
            className='border rounded-md p-3 border-gray-300' 
            keyboardType='email-address' 
            value={email}
            onChangeText={setEmail}
            autoCapitalize='none'
          />
        </View>

        {/* Password Input with Toggle */}
        <View className='mb-4'>
          <Text className='text-lg font-semibold mb-1'>Password</Text>
          <View className='flex-row items-center border rounded-md px-3 border-gray-300'>
            <TextInput
              placeholder='Password'
              className='flex-1 p-3'
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

        {/* Remember Me and Forgot Password */}
        <View className='flex-row items-center justify-between mb-6'>
          <View className='flex-row items-center'>
            <Checkbox 
              value={isChecked} 
              onValueChange={setChecked} 
              color={isChecked ? '#000' : undefined} 
            />
            <Text className='ml-2 text-gray-500'>Remember me</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text className='text-black font-semibold'>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity 
          className={`bg-black p-3 rounded-md ${loading ? 'opacity-50' : ''}`} 
          onPress={onSignIn}
          disabled={loading}
        >
          <Text className='text-white text-center text-lg font-bold'>
            {loading ? 'Loading...' : 'Login'}
          </Text>
        </TouchableOpacity>

        {/* Register Redirect */}
        <Text className='text-center text-gray-500 mt-4'>
          Don't have an account? 
          <TouchableOpacity onPress={() => router.push('/SigninPage')}>
            <Text className='text-black font-semibold'> Register</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

export default LoginPage;
