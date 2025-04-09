import { View, Text, TextInput, FlatList, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TimeToTake, TypeList, WhenToTake } from '~/Constants/Options';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '~/utils/firebase';
import { getLocalStorage } from '~/service/Storage';
import { useRouter } from 'expo-router';

const AddMedicationForm = () => {
    const [formData, setFormData] = useState<{ [key: string]: string | { name: string; icon: string } | number }>({});
    const [loading, setLoading ] = useState(false) 
    const router = useRouter()
  

    const handleInputChange = (field: string, value: string | { name: string; icon: string } | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const saveMedication = async() => {
    const user = await getLocalStorage('userDetail')
        const docId= Date.now().toString();
        if (!(formData?.name || formData.type || formData.dosage || formData.when || formData.days)) {
            ToastAndroid.show('Please Fill in all the fields',ToastAndroid.BOTTOM)
            return;
        }
        setLoading(true)
        try {
            await setDoc(doc(db,'user-added-medication', docId),{
                ...formData,
                userEmail: user?.email,
                docId:docId
            })
            console.log('Data saved')
            ToastAndroid.show('Medication saved successfuly', ToastAndroid.BOTTOM)
            router.push('/(tabs)')
            
        } catch (error) {
            console.log(error)
            ToastAndroid.show('Error Saving Medication', ToastAndroid.BOTTOM)
        setLoading(false);
        }
        setLoading(false);
    }

    return (
        <View className="mt-10 bg-green-50 h-full m-4 rounded-md p-2">
            <Text className="text-2xl mt-3 font-popSb">Add new medication</Text>
            <View className="flex gap-5">

                {/* Medication Name */}
                <View className="flex flex-row items-center border rounded-md p-2 mt-5 bg-white border-gray-100">
                    <Ionicons name="medkit-outline" size={24} color="#22b378" />
                    <TextInput
                        placeholder="Medication Name"
                        className="w-[90%] pl-4 font-pop"
                        onChangeText={(value) => handleInputChange('name', value)}
                    />
                </View>

                {/* Medication Types */}
                <FlatList
                    data={TypeList}
                    horizontal
                    contentContainerStyle={{ width: '100%', marginRight: 10 }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => handleInputChange('type', { name: item.name, icon: item.icon })}
                            key={index}
                            className={`flex flex-row items-center p-3 py-4 rounded-md border mt-2 border-gray-100 ${
                                (formData.type as { name: string; icon: string })?.name === item.name
                                    ? 'bg-green-500'
                                    : 'bg-white'
                            }`}
                        >
                            <Text
                                className={`text-[13px] font-popSb ${
                                    (formData.type as { name: string; icon: string })?.name === item.name
                                        ? 'text-white'
                                        : 'text-black'
                                }`}
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {/* Dosage */}
                <View className="flex flex-row items-center border rounded-md p-2 mt-5 bg-white border-gray-100">
                    <Ionicons name="eyedrop-outline" size={24} color="#22b378" />
                    <TextInput
                        placeholder="Dosage Eg. 10ml, 5ml"
                        className="w-[90%] pl-4 font-pop"
                        onChangeText={(value) => handleInputChange('dosage', value)}
                    />
                </View>

                {/* Time to Take */}
                <View className="flex flex-row items-center border rounded-md p-2 mt-5 bg-white border-gray-100">
                    <Ionicons name="time-outline" size={24} color="#22b378" />
                    <Picker
                        selectedValue={formData?.when}
                        onValueChange={(itemValue) => handleInputChange('when', itemValue)}
                        style={{ width: '90%' }}
                    >
                        <Picker.Item label="Select a Time Interval" value="" enabled={false} color="gray" />
                        {WhenToTake.map((item, index) => (
                            <Picker.Item key={index} label={item} value={item} />
                        ))}
                    </Picker>
                </View>

                {/* Start Date */}
                <View className='flex flex-row items-center border rounded-md p-2 mt-5 bg-white border-gray-100'>
                    <Ionicons name="calendar-outline" size={24} color="#22b378" />
                    <TextInput 
                        placeholder='Number of Days' 
                        className='w-[90%] pl-4 font-pop' 
                        keyboardType="numeric"
                        onChangeText={(value) => handleInputChange('days', parseInt(value) || 0)}
                    />
                </View>
               
                {/* Start Time */}
                <View className="flex flex-row items-center border rounded-md p-2 mt-5 bg-white border-gray-100">
                    <Ionicons name="time-outline" size={24} color="#22b378" />
                    <Picker
                        selectedValue={formData?.when}
                        onValueChange={(itemValue) => handleInputChange('when', itemValue)}
                        style={{ width: '90%' }}
                    >
                        <Picker.Item label="Select a Start Time" value="" enabled={false} color="gray" />
                        {TimeToTake.map((item, index) => (
                            <Picker.Item key={index} label={item} value={item} />
                        ))}
                    </Picker>
                </View>

                {/* set Reminder input */}

                {/* Submit Button */}
                <TouchableOpacity
                onPress={saveMedication}
                className="w-full py-4 px-4 bg-green-1 rounded-md">
                    {loading ? 
                    <ActivityIndicator size={'large'} color={'white'}/> :
                    <Text className="text-center text-white text-2xl font-popSb">Add Medication</Text>

                    }
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddMedicationForm;
