import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import MedicationHeader from '~/components/add-new/MedicationHeader'
import AddMedicationForm from '~/components/add-new/AddMedicationForm'

const AddNewMeds = () => {
  return (
    <ScrollView className='h-full bg-white'>
      <MedicationHeader/>
      <AddMedicationForm/>
    </ScrollView>
  )
}

export default AddNewMeds