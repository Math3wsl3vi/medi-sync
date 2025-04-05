import { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "~/utils/firebase";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";

// Medication interface with reminder times and taken status
interface Medication {
  name: string;
  dosage: string;
  amount: number;
  frequency: string;
  duration: string;
  quantity: string;
  reminderTimes?: string[];
  takenToday?: boolean[]; // Tracks if each dose was taken today
}

interface Patient {
  id: string;
  name: string;
  patientId: number;
  email: string;
  consultationFee: number;
  totalAmount: number;
  medications: Medication[];
  latestVisitDate: string;
}

const calculateReminderTimes = (frequency: string, wakeUpTime: string): string[] => {
  const [wakeHour, wakeMinute] = wakeUpTime.split(":").map(Number);
  const baseTime = new Date();
  baseTime.setHours(wakeHour, wakeMinute, 0, 0);

  const addHours = (date: Date, hours: number) => {
    const newDate = new Date(date);
    newDate.setHours(date.getHours() + hours);
    return newDate.toTimeString().slice(0, 5);
  };

  switch (frequency.toLowerCase()) {
    case "1x/day":
      return [wakeUpTime];
    case "2x/day":
      return [wakeUpTime, addHours(baseTime, 12)];
    case "3x/day":
      return [wakeUpTime, addHours(baseTime, 6), addHours(baseTime, 12)];
    case "4x/day":
      return [wakeUpTime, addHours(baseTime, 5), addHours(baseTime, 10), addHours(baseTime, 15)];
    default:
      return [wakeUpTime];
  }
};

export default function MedicationComponent() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [wakeUpTime, setWakeUpTime] = useState<string>("07:00");
  const [currentDate, setCurrentDate] = useState(new Date().toDateString()); // Track current day
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      const email = user.email;
      if (!email) return;

      try {
        const userRef = doc(db, "users", email.replace(/[@.]/g, "_"));
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};
        const fetchedWakeUpTime = userData.wakeUpTime || "07:00";
        setWakeUpTime(fetchedWakeUpTime);

        const patientRef = doc(db, "invoices", email.replace(/[@.]/g, "_"));
        const docSnap = await getDoc(patientRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const { latestMedications, latestVisitDate } = await fetchLatestMedications(email);

          const medicationsWithReminders = latestMedications.map((med) => ({
            ...med,
            reminderTimes: med.reminderTimes || calculateReminderTimes(med.frequency, fetchedWakeUpTime),
            takenToday: med.takenToday || new Array(med.reminderTimes?.length || 1).fill(false), // Initialize taken status
          }));

          setPatient({
            id: email,
            name: data.patientName || "Unknown",
            patientId: data.patientId || "N/A",
            email: data.patientEmail || email,
            consultationFee: data.consultationFee || 0,
            totalAmount: data.totalAmount || 0,
            medications: medicationsWithReminders,
            latestVisitDate,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    });

    // Reset taken status daily
    const interval = setInterval(() => {
      const newDate = new Date().toDateString();
      if (newDate !== currentDate) {
        setCurrentDate(newDate);
        setPatient((prev) =>
          prev
            ? {
                ...prev,
                medications: prev.medications.map((med) => ({
                  ...med,
                  takenToday: new Array(med.reminderTimes?.length || 1).fill(false),
                })),
              }
            : null
        );
      }
    }, 60000); // Check every minute

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [currentDate]);

  const fetchLatestMedications = async (email: string) => {
    const emailKey = email.replace(/[@.]/g, "_");
    const visitsCollectionRef = collection(db, "patient-medication", emailKey, "visits");
    const visitSnapshots = await getDocs(visitsCollectionRef);

    if (visitSnapshots.empty) {
      return { latestMedications: [], latestVisitDate: "Unknown" };
    }

    let latestVisitId = "";
    let latestTimestamp = 0;

    visitSnapshots.docs.forEach((visitDoc) => {
      const timestamp = Number(visitDoc.id.match(/visit_(\d+)/)?.[1] || 0);
      if (timestamp > latestTimestamp) {
        latestTimestamp = timestamp;
        latestVisitId = visitDoc.id;
      }
    });

    if (!latestVisitId) {
      return { latestMedications: [], latestVisitDate: "Unknown" };
    }

    const medicationsCollectionRef = collection(db, "patient-medication", emailKey, "visits", latestVisitId, "medications");
    const medicationsSnapshot = await getDocs(medicationsCollectionRef);

    const latestMedications: Medication[] = medicationsSnapshot.docs.map((doc) => ({
      name: doc.data().name || "Unknown",
      dosage: doc.data().dosage || "N/A",
      amount: doc.data().amount || 0,
      frequency: doc.data().frequency || "N/A",
      duration: doc.data().duration || "N/A",
      quantity: doc.data().quantity || "N/A",
      reminderTimes: doc.data().reminderTimes || undefined,
      takenToday: doc.data().takenToday || undefined,
    }));

    const latestVisitDate = new Date(latestTimestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return { latestMedications, latestVisitDate };
  };

  const markDoseTaken = (medIndex: number, doseIndex: number) => {
    setPatient((prev) =>
      prev
        ? {
            ...prev,
            medications: prev.medications.map((med, i) =>
              i === medIndex && med.takenToday
                ? { ...med, takenToday: med.takenToday.map((taken, j) => (j === doseIndex ? true : taken)) }
                : med
            ),
          }
        : null
    );
  };

  const handleDrugPress = (med: Medication, index: number) => {
    router.push({
      pathname: "/medication",
      params: {
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        reminderTimes: JSON.stringify(med.reminderTimes),
        takenToday: JSON.stringify(med.takenToday),
        index: index.toString(),
      },
    });
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
        <Image source={require("./../../assets/find.png")} className="w-full h-[500px]" />
        <Text className="text-[40px] mt-5 text-green-1 font-popB">No Medications For You!</Text>
        <View className="h-[50px]" />
      </View>
    );
  }

  return (
    <ScrollView className="bg-white h-full p-1 mt-4 w-full mb-[200px]">
      <View>
        <Text className="text-lg font-semibold text-green-700 font-popSb">
          Visited The Hospital on: {patient.latestVisitDate}
        </Text>
        <View className="flex flex-row flex-wrap gap-4">
          {patient.medications.map((med, index) => (
            <TouchableOpacity
              onPress={() => handleDrugPress(med, index)}
              key={index}
              className="w-[48%] bg-green-50 p-3 rounded-2xl shadow-sm mt-3 h-36"
            >
              <View className="flex-1 flex flex-row mb-2">
                <View>
                  <Image source={require("./../../assets/drug.png")} className="w-10 h-10" />
                </View>
                <View>
                  <Text className="font-popSb text-xs">MediSync</Text>
                  <Text className="text-xl font-popSb text-gray-500 capitalize">{med.name}</Text>
                </View>
              </View>
              <View className="flex flex-row justify-between items-center">
                <View className="bg-green-100 p-2 py-3 rounded-xl h-fit flex justify-end px-4 w-32 items-center">
                  <Text className="text-gray-600 text-lg font-popSb">
                    {med.reminderTimes?.[0] || "N/A"}
                  </Text>
                  <Text className="text-sm text-gray-500 font-popSb">
                    {med.takenToday?.[0] ? "Taken" : "Pending"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => markDoseTaken(index, 0)} // Mark first dose as taken
                  className="justify-center flex items-center p-2 rounded-full bg-white"
                >
                  <Image source={require("./../../assets/check1.png")} style={{ width: 16, height: 16, tintColor:'#22b73a' }} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}