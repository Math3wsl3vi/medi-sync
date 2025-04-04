import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { getLocalStorage } from '~/service/Storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '~/utils/firebase';
import MedicationListCard from './MedicationListCard';
import MedicationComponent from './MedicationComponent';

// ✅ Define a proper type for medications
type Medication = {
    id: string;
    name: string;
    dosage: string;
    frequency?: string;
    duration?: string;
    type?: {
        icon: string;
        name: string;
    };
    date?: string; // Ensure we can filter by date
};

const MedicationReminder = () => {
    const [medList, setMedList] = useState<Medication[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(moment().format('ddd,DD'));

    // Generate the next 7 days
    const nextSevenDays = Array.from({ length: 7 }, (_, i) =>
        moment().add(i, 'days').format('ddd,DD')
    );

    const fetchAllMedications = useCallback(async () => {
        try {
            const email = await getLocalStorage("email"); 
            if (!email) {
                console.error("❌ Error: Email is undefined or null.");
                return;
            }

            console.log(`Fetching medications for email: ${email}`);
            const emailKey = email.replace(/[@.]/g, "_");

            // Fetch hospital medications
            const visitsCollectionRef = collection(db, "patient-medication", emailKey, "visits");
            const visitSnapshots = await getDocs(visitsCollectionRef);
            let hospitalMedications: Medication[] = [];

            for (const visitDoc of visitSnapshots.docs) {
                const medicationsCollectionRef = collection(visitDoc.ref, "medications");
                const medicationsSnapshot = await getDocs(medicationsCollectionRef);
                hospitalMedications.push(
                    ...medicationsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        name: doc.data().name || "Unknown",
                        dosage: doc.data().dosage || "N/A",
                        frequency: doc.data().frequency?.toString() || "1",
                        duration: doc.data().duration || "N/A",
                        date: doc.data().date || moment().format('ddd,DD'), // Store date if available
                        
                    }))
                );
            }

            console.log("✅ Hospital medications:", hospitalMedications);

            // Fetch user-added medications
            const userMedicationsRef = collection(db, "user-medications", emailKey, "medications");
            const userMedicationsSnapshot = await getDocs(userMedicationsRef);
            const userMedications = userMedicationsSnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name || "Unknown",
                dosage: doc.data().dosage || "N/A",
                frequency: doc.data().frequency?.toString() || "1",
                duration: doc.data().duration || "N/A",
                date: doc.data().date || moment().format('ddd,DD'),
                source: "user",
            }));

            console.log("✅ User-added medications:", userMedications);

            // Combine both lists and update state
            const allMedications = [...hospitalMedications, ...userMedications];
            console.log("✅ Final combined medications:", allMedications);
            setMedList(allMedications);
        } catch (error) {
            console.error("❌ Error fetching medications:", error);
        }
    }, []);

    useEffect(() => {
        fetchAllMedications();
    }, [fetchAllMedications]);

    // Filter medications based on selected date
    const filteredMedications = medList.filter(med => med.date === selectedDate);

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
                contentContainerStyle={{}}
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
            {/* <FlatList
                data={filteredMedications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                   <TouchableOpacity>
                     <MedicationListCard medicine={item} />
                   </TouchableOpacity>
                )}
                ListEmptyComponent={<Text className="text-gray-500">No medications for this day</Text>}
            /> */}
           <MedicationComponent/>
        </View>
    );
};

export default MedicationReminder;
