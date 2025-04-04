import { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "~/utils/firebase";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import Entypo from "@expo/vector-icons/Entypo";
import EmptyMedication from "./EmptyMedication";

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
  medications: Medication[]; // Only latest visit's medications
  latestVisitDate: string;
}

export default function MedicationComponent() {
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

          // Fetch latest visit medications
          const { latestMedications, latestVisitDate } = await fetchLatestMedications(email);

          setPatient({
            id: email,
            name: data.patientName || "Unknown",
            patientId: data.patientId || "N/A",
            email: data.patientEmail || email,
            consultationFee: data.consultationFee || 0,
            totalAmount: data.totalAmount || 0,
            medications: latestMedications,
            latestVisitDate,
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

  const fetchLatestMedications = async (email: string) => {
    try {
      console.log(`Fetching medications for email: ${email}`);

      const emailKey = email.replace(/[@.]/g, "_");
      const visitsCollectionRef = collection(db, "patient-medication", emailKey, "visits");

      const visitSnapshots = await getDocs(visitsCollectionRef);
      if (visitSnapshots.empty) {
        console.warn("No visits found.");
        return { latestMedications: [], latestVisitDate: "Unknown" };
      }

      // Get latest visit (highest timestamp)
      let latestVisitId = "";
      let latestTimestamp = 0;

      visitSnapshots.docs.forEach((visitDoc) => {
        const visitId = visitDoc.id;
        const timestampMatch = visitId.match(/visit_(\d+)/);
        const timestamp = timestampMatch ? Number(timestampMatch[1]) : 0;

        if (timestamp > latestTimestamp) {
          latestTimestamp = timestamp;
          latestVisitId = visitId;
        }
      });

      if (!latestVisitId) {
        return { latestMedications: [], latestVisitDate: "Unknown" };
      }

      // Fetch medications from the latest visit
      const medicationsCollectionRef = collection(db, "patient-medication", emailKey, "visits", latestVisitId, "medications");
      const medicationsSnapshot = await getDocs(medicationsCollectionRef);

      const latestMedications: Medication[] = medicationsSnapshot.docs.map((doc) => ({
        name: doc.data().name || "Unknown",
        dosage: doc.data().dosage || "N/A",
        amount: doc.data().amount || 0,
        frequency: doc.data().frequency || "N/A",
        duration: doc.data().duration || "N/A",
        quantity: doc.data().quantity || "N/A",
      }));

      const latestVisitDate = new Date(latestTimestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      console.log(`Latest visit date: ${latestVisitDate}, Medications found: ${latestMedications.length}`);
      return { latestMedications, latestVisitDate };
    } catch (error) {
      console.error("Error fetching latest medications:", error);
      return { latestMedications: [], latestVisitDate: "Unknown" };
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#22b73a" />
      </View>
    );
  }

  if (!patient || patient.medications.length === 0) {
    return (
      <View>
            <Image source={require('./../../assets/find.png')} className='w-full h-[500px]'/>
            <Text className='text-[40px] mt-5 text-green-1 font-popB'>No Medications For You!</Text>
            <View className="h-[50px]"></View>
          </View>
    );
  }

  const handleDrugPress = (med:Medication) => { 
    router.push({
      pathname: '/medication',
      params: {
        name:med.name,
        dosage:med.dosage,
        frequency: med.frequency,
        duration:med.duration
      }
    })
  }

  return (
    <ScrollView className="bg-white h-full p-1 mt-4 w-full mb-[200px]">
      <View>
        {/* <Text className="mt-8 text-xl font-popSb text-center text-green-1">
          Latest Medication
        </Text> */}

        <Text className="text-lg font-semibold text-green-700 font-popSb">
          Visited The Hospital on: {patient.latestVisitDate}
        </Text>
        <View className="flex flex-row flex-wrap gap-4">
        {patient.medications.map((med, index) => (
          <TouchableOpacity
          onPress={()=>handleDrugPress(med)}
            key={index}
           className="w-[48%] bg-green-50 p-3 rounded-2xl shadow-sm mt-3 h-36"
          >
            <View className="flex-1 flex flex-row mb-2">
              <View>
                <Image source={require('./../../assets/drug.png')} className="w-10 h-10"/>
              </View>
             <View>
             <Text className="font-popSb text-xs">MediSync</Text>
              <Text className="text-xl font-popSb text-gray-500 capitalize">
                {med.name}
              </Text>
             </View>
            </View>
            <View className="flex flex-row justify-between items-center">
            <View className="bg-green-100 p-2 py-3 rounded-xl h-fit flex justify-end px-4 w-32 items-center">
              <Text className="text-gray-600 text-lg font-popSb">
               7:00 AM
              </Text>
            </View>
            <TouchableOpacity 
              onPress={()=>router.back()}
              className="justify-center flex items-center p-2 rounded-full bg-white">
              <Image source={require('./../../assets/right-up.png')} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
          </View>
          </TouchableOpacity>
        ))}
        </View>
      </View>
    </ScrollView>
  );
}
