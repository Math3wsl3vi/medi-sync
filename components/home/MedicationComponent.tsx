import { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "~/utils/firebase";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import Entypo from "@expo/vector-icons/Entypo";

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
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#22b73a" />
      </View>
    );
  }

  if (!patient || patient.medications.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-500">No recent medications found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-white h-full p-4 w-full">
      <View>
        <Text className="mt-8 text-xl font-popSb text-center text-green-1">
          Latest Medication
        </Text>

        <Text className="text-lg font-semibold text-green-700 font-popSb">
          Visited Hospital on: {patient.latestVisitDate}
        </Text>

        {patient.medications.map((med, index) => (
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
    </ScrollView>
  );
}
