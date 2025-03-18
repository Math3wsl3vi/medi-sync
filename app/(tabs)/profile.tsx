import { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '~/utils/firebase';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import Entypo from '@expo/vector-icons/Entypo';

interface Medication {
  name: string;
  dosage: string;
  amount: number;
  frequency:string;
  duration:string;
  quantity:string;
}

interface Patient {
  id: string;
  name: string;
  patientId: number;
  email: string;
  consultationFee: number;
  totalAmount: number;
  medications: Medication[];
}

export default function PatientProfile() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login');
        return;
      }

      const email = user.email;
      if (!email) {
        console.error('User email not found.');
        return;
      }

      try {
        const patientRef = doc(db, 'invoices', email);
        const docSnap = await getDoc(patientRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPatient({
            id: email,
            name: data.patientName,
            patientId: data.patientId,
            email: data.patientEmail,
            consultationFee: data.consultationFee,
            totalAmount: data.totalAmount,
            medications: data.medications || [], // Handle empty meds
          } as Patient);
        } else {
          console.log('No patient data found.');
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!patient) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-500">Patient data not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-white h-full p-4">
      <View className="">
        <Text className="text-xl font-semibold text-green-1 font-popSb text-center capitalize mt-5">Patient Info</Text>
        <View className='flex flex-row gap-4 justify-between w-full p-2 mt-5'>
          <View className='w-1/2 flex gap-4'>
          <Text className="text-gray-600 border border-green-1 w-full p-3 rounded-md font-pop text-sm">Name: {patient.name}</Text>
        <Text className="text-gray-600 border border-green-1 w-full p-3 rounded-md font-pop text-sm">Email: {patient.email}</Text>
          </View>
          <View className='w-1/2 flex gap-4'>
          <Text className="text-gray-600 border border-green-1 w-full p-3 rounded-md font-pop text-sm">Patient ID: {patient.patientId}</Text>
          {/* <Text className="text-gray-600 border border-green-1 w-full p-3 rounded-md font-pop text-sm">Total Amount: Ksh {patient.totalAmount}</Text> */}
          </View>

        </View>
        
        

        <Text className="mt-8 text-xl font-popSb text-center text-green-1"> Recent Medications</Text>
        {patient.medications.length > 0 ? (
          patient.medications.map((med, index) => (
            <View key={index} className="mt-5">
              <View className='w-full p-2 rounded-xl flex flex-row justify-between border gap-4 border-gray-100'>
              <View className='flex-1'>
                <Text className='text-xl font-popSb text-gray-500 capitalize'>{med.name}</Text>
                <Text className='text-xl font-semibold font-popSb uppercase text-green-1 mt-5'>{med.dosage}</Text>
              </View>
              <View className='bg-slate-50 p-2 rounded-xl h-fit flex justify-end px-4'>
              <View className='flex flex-row gap-1 items-center'>
              <Text className="text-gray-600 text-2xl font-pop">{med.quantity}</Text>
              <Entypo name="cross" size={24} color="black" />
              <Text className="text-gray-600 text-2xl font-pop">{med.frequency}</Text>
              </View>
              <Text className="text-gray-600 text-xl font-pop">{med.duration} days</Text>
              </View>
              
            </View>
        </View>

          ))
        ) : (
          <Text className="text-gray-500">No medications found.</Text>
        )}
      </View>
    </ScrollView>
  );
}
