import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { getLocalStorage } from '~/service/Storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '~/utils/firebase';
import MedicationListCard from './MedicationListCard';

// ✅ Define a proper type for medications
type Medication = {
    name: string;
    dosage: string;
    when:string;
    type?: {
      icon: string;
      name:string;
    };
};

const MedicationReminder = () => {
    const [medList, setMedList] = useState<Medication[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(moment().format('ddd,DD'));

    useEffect(() => {
        GetMedicationList(selectedDate);
    }, [selectedDate]); // ✅ Runs when selectedDate changes

    // Generate the next 7 days
    const nextSevenDays = Array.from({ length: 7 }, (_, i) => 
        moment().add(i, 'days').format('ddd,DD')
    );

    const GetMedicationList = async (selectedDate: string) => {
        const user = await getLocalStorage('userDetail');
        try {
            const q = query(
                collection(db, 'patient-medication'),
                where('userEmail', '==', user?.email)
            );

            const querySnapshot = await getDocs(q);
            const medications: Medication[] = []; // ✅ Use the correct type

            querySnapshot.forEach((doc) => {
                console.log('docId', doc.id, '==>', doc.data());
                medications.push(doc.data() as Medication); // ✅ Explicit type assertion
            });

            setMedList(medications); // ✅ No more type errors

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View className="items-center p-1">
            {/* Medication Image */}
            <Image 
                source={require('./../../assets/pharm.png')} 
                style={{ width: 300, height: 200, marginBottom: 10 }}
                resizeMode="contain"
                className="mb-5"
            />

            {/* Display Next 7 Days */}
            <FlatList
                data={nextSevenDays}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: -1 }}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setSelectedDate(item)}>
                        <View className={`mx-2 rounded-md p-4 py-7 ${
                            selectedDate === item ? 'bg-green-500' : 'bg-green-100'
                        }`}>
                            <Text className={`text-lg font-popSb ${
                                selectedDate === item ? 'text-white' : 'text-gray-700'
                            }`}>
                                {item}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            {/* Display Medications */}
            <FlatList
                data={medList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                   <TouchableOpacity>
                     <MedicationListCard medicine={item} />
                   </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default MedicationReminder;
