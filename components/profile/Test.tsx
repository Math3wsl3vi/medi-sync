import { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "~/utils/firebase";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import Entypo from "@expo/vector-icons/Entypo";
import ProfileHeader from "~/components/profile/ProfileHeader";

interface Medication {
  name: string;
  dosage: string;
  amount: number;
  frequency: string;
  duration: string;
  quantity: string;
}

interface Patient {
  id: string;
  name: string;
  patientId: number;
  email: string;
  consultationFee: number;
  totalAmount: number;
  medications: Record<string, Medication[]>; // Grouped by timestamp
}

export default function PatientProfile() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn("No user found, redirecting to login...");
        router.replace("/login");
        return;
      }
  
      const email = user.email;
      if (!email) {
        console.error("User email not found.");
        return;
      }
  
      try {
        console.log(`Fetching patient data for email: ${email}`);
  
        const patientRef = doc(db, "invoices", email.replace(/[@.]/g, "_"));
        const docSnap = await getDoc(patientRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
  
          // Debugging patient document
          console.log("Patient document data:", data);
  
          // Fetch medications grouped by timestamp
          const medications = await fetchMedicationsGroupedByVisitId(email);
  
          setPatient({
            id: email,
            name: data.patientName || "Unknown",
            patientId: data.patientId || "N/A",
            email: data.patientEmail || email,
            consultationFee: data.consultationFee || 0,
            totalAmount: data.totalAmount || 0,
            medications: medications, // Now correctly mapped
          });
        } else {
          console.warn("No patient data found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    });
  
    return () => {
      console.log("Unsubscribing from auth state changes...");
      unsubscribe();
    };
  }, []);
  
  const fetchMedicationsGroupedByVisitId = async (email: string) => {
    try {
      console.log(`Fetching medications for email: ${email}`);
      
      const emailKey = email.replace(/[@.]/g, "_");
      const visitsCollectionRef = collection(db, "patient-medication", emailKey, "visits");
  
      // Fetch all visit documents
      const visitSnapshots = await getDocs(visitsCollectionRef);
      console.log(`Found ${visitSnapshots.docs.length} visits`);
  
      if (visitSnapshots.empty) {
        console.warn("No visits found.");
        return {};
      }
  
      let groupedMedications: Record<string, Medication[]> = {};
  
      for (const visitDoc of visitSnapshots.docs) {
        const visitId = visitDoc.id;
        console.log(`Processing visit ID: ${visitId}`);
  
        const medicationsCollectionRef = collection(visitDoc.ref, "medications");
        const medicationsSnapshot = await getDocs(medicationsCollectionRef);
  
        console.log(`Found ${medicationsSnapshot.docs.length} items for visit ${visitId}`);
  
        if (!medicationsSnapshot.empty) {
          groupedMedications[visitId] = medicationsSnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log(`Fetched item data:`, data);
            return {
              id: doc.id,
              name: data.name || "Unknown",
              dosage: data.dosage || "N/A",
              amount: data.amount || 0,
              frequency: data.frequency || "N/A",
              duration: data.duration || "N/A",
              quantity: data.quantity || "N/A",
            };
          });
        } else {
          console.warn(`No medications found for visit ID ${visitId}`);
        }
      }
  
      console.log("Final grouped medications:", groupedMedications);
      return groupedMedications;
    } catch (error) {
      console.error("Error fetching medications:", error);
      return {};
    }
  };
  

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#22b73a" />
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
    <ScrollView className="bg-white h-full p-4 w-full">
      <ProfileHeader/>
    <View>
      <Text className="text-xl font-semibold text-green-1 font-popSb text-center capitalize mt-5">
        Patient Info
      </Text>
      <View className="flex flex-col gap-4 justify-between w-full p-3 mt-5 border border-green-50 rounded-md bg-green-50 py-5">
        <View className="w-[48%] flex flex-row gap-4">
          <Text className="text-gray-600 w-full p-3 rounded-md font-pop text-sm bg-white">
            Name: {patient.name}
          </Text>
          <Text className="text-gray-600 w-full p-3 rounded-md font-pop text-sm bg-white">
            National Id: {patient.patientId}
          </Text>
        </View>
        <View className="w-full flex gap-4">
          <Text className="text-gray-600 w-full p-3 rounded-md font-pop text-sm bg-white">
            Email: {patient.email}
          </Text>
        </View>
      </View>
  
      <Text className="mt-8 text-xl font-popSb text-center text-green-1">
        Recent Medications
      </Text>
  
      {Object.keys(patient.medications).length > 0 ? (
        Object.entries(patient.medications).map(([visitId, meds]) => {
          // Extract timestamp from visitId 
          const timestampMatch = visitId.match(/visit_(\d+)/);
          const timestamp = timestampMatch ? Number(timestampMatch[1]) : null;

          let formattedDate = "Unknown Date";
            if (timestamp) {
              formattedDate = new Date(timestamp).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            }

            console.log("Formatted Visit Date:", formattedDate);
          
          return (
            <View key={visitId} className="mt-5">
              <Text className="text-lg font-semibold text-green-700 font-popSb">
               Visited Hospital on : {formattedDate}
              </Text>
  
              {meds.map((med, index) => (
                <View
                  key={index}
                  className="w-full p-2 rounded-xl flex flex-row justify-between border gap-4 border-gray-100 mt-3"
                >
                  <View className="flex-1">
                    <Text className="text-xl font-popSb text-gray-500 capitalize">
                      {med.name}
                    </Text>
                    <Text className="text-xl font-semibold font-popSb uppercase text-green-1 mt-5">
                      Ksh {med.amount}
                    </Text>
                  </View>
                  <View className="bg-slate-50 p-2 rounded-xl h-fit flex justify-end px-4 w-32 items-center">
                    <View className="flex flex-row gap-1 items-center">
                      <Text className="text-gray-600 text-2xl font-pop">
                        {med.dosage}
                      </Text>
                      <Entypo name="cross" size={22} color="black" />
                      <Text className="text-gray-600 text-2xl font-pop">
                        {med.frequency}
                      </Text>
                    </View>
                    <Text className="text-gray-600 text-sm font-pop">
                      {med.duration} days
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          );
        })
      ) : (
        <Text className="text-gray-500">No medications found.</Text>
      )}
    </View>
  </ScrollView>
  
  );
}
