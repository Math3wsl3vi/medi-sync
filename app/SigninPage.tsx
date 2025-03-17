import { View, Text, TextInput, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '~/utils/firebase';


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
      if (!email || !password) {
        ToastAndroid.show('Please enter both email and password.',ToastAndroid.BOTTOM);
        return;
      }
      try {
          setLoading(true)
        await signInWithEmailAndPassword(auth, email, password);
        ToastAndroid.show('Success, Logged in successfully!', ToastAndroid.BOTTOM);
        router.push('/(tabs)'); 
      }catch (error) {
          Alert.alert('Login Failed', (error as Error).message);
          console.log(error)
        }finally{
          setLoading(false)
        }
    };

  return (
    <View className='flex-1 items-center justify-center bg-gray-100 p-4'>
      {/* Form Container */}
      <View className='bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md'>
        <Text className='text-2xl font-bold text-center mb-1'>Welcome to MediSync</Text>
        <Text className='text-center text-gray-500 mb-6 font-semibold'>Let's Sign You In</Text>

        {/* Name Input */}
        <View className='mb-4'>
          <Text className='text-lg font-semibold mb-1'>Name</Text>
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
          <Text className='text-lg font-semibold mb-1'>Email</Text>
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
          <Text className='text-lg font-semibold mb-1'>Password</Text>
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
        <TouchableOpacity className='bg-black p-3 rounded-md' onPress={onSignIn}>
          <Text className='text-white text-center text-lg font-bold'>Sign Up</Text>
        </TouchableOpacity>

        {/* Login Redirect */}
        <Text className='text-center text-gray-500 mt-4'>
          Already have an account? <TouchableOpacity onPress={()=>router.push('/sign-up')}><Text className='text-black font-semibold'>Login</Text></TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

export default SigninPage;
