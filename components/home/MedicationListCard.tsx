import { View, Text, Image } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

interface Medication {
    name: string;
    dosage: string;
    when:string;
    type?: {
      icon: string;
      name:string;
    };
  }
  
  interface MedicationListCardProps {
    medicine: Medication;
  }
  
  const MedicationListCard: React.FC<MedicationListCardProps> = ({ medicine }) => {
  return (
    <View className='mt-5'>
      <View className='w-full p-2 rounded-xl flex flex-row justify-between border gap-4 border-gray-100'>
        <View className='bg-slate-50 p-2 rounded-xl'>
        <Image source={{uri:medicine?.type?.icon}} className='h-20 w-20'/>
        </View>
        <View className='flex-1'>
            <Text className='text-3xl font-bold'>{medicine.name}</Text>
            <Text className='text-xl font-semibold'>{medicine.dosage}</Text>
            <Text className='font-semibold'>{medicine.type?.name}</Text>
        </View>
        <View className='bg-slate-50 p-2 rounded-xl h-fit flex justify-center items-center px-4'>
        <Ionicons name="timer-outline" size={24} color="#22b378" />
        <Text className='text-xl font-bold'>{medicine.when}</Text>
        </View>
      </View>
    </View>
  )
}

export default MedicationListCard