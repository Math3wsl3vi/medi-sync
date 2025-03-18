import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const LoginScreen = () => {
    const router = useRouter()
  return (
    <View>
      <View className='flex items-center mt-20'>
        <Image source={require('./../assets/top.jpeg')} className='w-[230px] h-[450px] rounded-md'/>
      </View>
      <View className='p-[25px] bg-green-1 h-full flex items-center -mt-1 rounded-xl'>
        <Text className='text-5xl uppercase font-bold text-white text-center font-popB'>Stay on track, stay healthy!</Text>
        <Text className='text-xl font-semibold mt-10 text-white text-center font-popSb'>Track your medication, take control of your health. Stay Consistent. Gotta Stay Ready. Gotta stay in the cold!</Text>
        <TouchableOpacity
        onPress={()=>router.push('/sign-up')}
        className='py-3 px-4 bg-white rounded-md w-full mt-5'>
            <Text className='text-center font-semibold text-lg text-green-1 font-popSb'>Continue</Text>
        </TouchableOpacity>
        <Text className='text-white mt-5 font-pop'>Note: By clicking this you agree to our terms and conditions.</Text>
      </View>
    </View>
  )
}

export default LoginScreen