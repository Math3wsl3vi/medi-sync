import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '~/utils/firebase';
import moment from 'moment';

interface Medication {
    name: string;
    dosage: string;
    // when:string;
    type?: {
      icon: string;
      name:string;
    };
  }
  
  interface MedicationListCardProps {
    medicine: Medication;
  }

  const markMedication = async (email: string, medicationId: string, taken: boolean) => {
    try {
        const emailKey = email.replace(/[@.]/g, "_");
        const historyRef = doc(db, "medication-tracking", emailKey, medicationId, "history", moment().format("YYYY-MM-DD"));

        await setDoc(historyRef, { taken, timestamp: Timestamp.now() });
        console.log(`✅ Medication ${medicationId} marked as ${taken ? "taken" : "missed"}`);
    } catch (error) {
        console.error("❌ Error updating medication status:", error);
    }
};

  
  const MedicationListCard: React.FC<MedicationListCardProps> = ({ medicine }) => {
  return (
    <View className='mt-5'>
      <View className='w-full p-2 rounded-xl flex flex-row justify-between border gap-4 border-gray-100'>
        <View className='bg-slate-50 p-2 rounded-xl'>
        <Image source={{uri:medicine?.type?.icon}} className='h-20 w-20'/>
        </View>
        <View className='flex-1'>
            <Text className='text-xl font-popSb text-gray-500 capitalize'>{medicine.name}</Text>
            <Text className='text-2xl font-semibold font-popSb uppercase text-green-1'>{medicine.dosage}</Text>
            <Text className='font-popSb text-gray-400 mt-5 uppercase'>{medicine.type?.name}</Text>
        </View>
        <View className='bg-slate-50 p-2 rounded-xl h-fit flex justify-center items-center px-4'>
        <Ionicons name="timer-outline" size={24} color="#22b378" />
        {/* <Text className='text-xl font-popB'>{medicine.when}</Text> */}
        </View>
        <View className='bg-slate-50 p-2 rounded-xl h-fit flex justify-between items-center px-4'>
        <TouchableOpacity onPress={() => markMedication(user.email, item.id, true)}>
            <Text>✅</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => markMedication(user.email, item.id, false)}>
            <Text>❌ </Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default MedicationListCard