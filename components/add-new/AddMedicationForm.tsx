import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { TypeList, WhenToTake } from '~/Constants/Options';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const AddMedicationForm = () => {
    const [formData, setFormData] = useState<{ [key: string]: string | { name: string; icon: string } | Date }>({});
    const [showStartDate, setShowStartDate ] = useState(false)

    const handleInputChange = (field: string, value: string | { name: string; icon: string } | Date) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    
    return (
        <View className='mt-10 bg-green-50 h-full m-4 rounded-md p-2'>
            <Text className='text-3xl font-semibold'>Add new medication</Text>
            <View className='flex gap-5'>

                <View className='flex flex-row items-center border rounded-md p-2 mt-5 bg-white border-gray-100'>
                    <Ionicons name="medkit-outline" size={24} color="#22b378" className='border-r pr-4' />
                    <TextInput 
                        placeholder='Medication Name' 
                        className='w-[90%] pl-4' 
                        onChangeText={(value) => handleInputChange('name', value)}
                    />
                </View>

                {/* Medication types */}
                <FlatList 
                    data={TypeList}
                    horizontal
                    contentContainerStyle={{ width: '100%', marginRight: 10 }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity 
                            onPress={() => handleInputChange('type', { name: item.name, icon: item.icon })}
                            style={{
                                backgroundColor: item.name === (formData.type as { name: string; icon: string })?.name ? '#22b378' : 'white'
                            }}
                            key={index} 
                            className='flex flex-row items-center p-3 py-4 rounded-md border mt-2 border-gray-100'
                        >
                            <Text 
                             style={{
                                color: item.name === (formData.type as { name: string; icon: string })?.name ? 'white' : 'black'
                            }}
                            className='text-[15px] font-semibold'>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />

                {/* Doses */}
                <View className='flex flex-row items-center border rounded-md p-2 mt-5 bg-white border-gray-100'>
                    <Ionicons name="eyedrop-outline" size={24} color="#22b378" className='border-r pr-4' />
                    <TextInput 
                        placeholder='Dosage Eg. 10ml, 5ml' 
                        className='w-[90%] pl-4' 
                        onChangeText={(value) => handleInputChange('name', value)}
                    />
                </View>

                {/* time to take */}
                <View className='flex flex-row items-center border rounded-md p-2 mt-5 bg-white border-gray-100'>
                    <Ionicons name="time-outline" size={24} color="#22b378" className='border-r pr-4' />
                    <Picker
                    selectedValue={formData?.when}
                    onValueChange={(itemValue, itemIndex)=>
                        handleInputChange('when', itemValue)
                    }
                    style={{width:'90%'}}
                    >
                    {/* Placeholder option */}
                    <Picker.Item label="Select a Time Interval" value="" enabled={false} color="gray" />


                       {WhenToTake.map((item, index)=>(
                        <Picker.Item key={index} label={item} value={item}/>
                       ))}
                    </Picker>
                </View>

                {/* start/end date */}
                <View className='flex flex-row gap-4 w-[95%]'>
                <TouchableOpacity
                onPress={()=>setShowStartDate(true)}
                className='flex flex-row items-center border rounded-md p-2 mt-5 bg-white border-gray-100 w-1/2'>
                    <Ionicons name="calendar-outline" size={24} color="#22b378" className='border-r pr-4' />
                </TouchableOpacity>
                {showStartDate && 
                    <RNDateTimePicker 
                    minimumDate={new Date()} 
                    onChange={(event, selectedDate) => {
                        if (selectedDate) {
                            handleInputChange('startDate', selectedDate.toISOString()); // Convert date to string
                        }
                        setShowStartDate(false);
                    }}
                    value={formData?.startDate ? new Date(formData.startDate) : new Date()} // Ensure value is a Date
                />
                
                }
                <View className='flex flex-row items-center border rounded-md p-2 mt-5 bg-white border-gray-100 w-1/2'>
                    <Ionicons name="calendar-outline" size={24} color="#22b378" className='border-r pr-4' />
                    <TextInput 
                        placeholder='End Date' 
                        className='w-[90%] pl-4' 
                        onChangeText={(value) => handleInputChange('name', value)}
                    />
                </View>
                </View>

                {/* StartTime */}
                <View className='flex flex-row items-center border rounded-md p-2 mt-5 bg-white border-gray-100'>
                    <Ionicons name="timer-outline" size={24} color="#22b378" className='border-r pr-4' />
                    <TextInput 
                        placeholder='End Date' 
                        className='w-[90%] pl-4' 
                        onChangeText={(value) => handleInputChange('name', value)}
                    />
                </View>

                {/*  */}
            </View>
        </View>
    );
};

export default AddMedicationForm;
