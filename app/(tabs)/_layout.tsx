import { Tabs, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "~/utils/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocalStorage } from "~/service/Storage";

export default function TabLayout() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Function to check user details from local storage
  const getUserDetail = async () => {
    const userInfo = await getLocalStorage("user"); // Use consistent key
    console.log("Retrieved user:", userInfo);

    if (!userInfo) {
      router.replace("/login");
    } else {
      setUser(userInfo); // Set local user state if foundr
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = await getLocalStorage("user");
      console.log("Retrieved user:", storedUser);
  
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        console.log("Auth state changed. User:", currentUser);
  
        if (currentUser) {
          setUser(currentUser);
          await AsyncStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          if (storedUser) {
            await AsyncStorage.removeItem("user"); // Clear storage if Firebase logs out
          }
          setUser(null);
          router.replace("/login");
        }
        setIsChecking(false);
      });
  
      return () => unsubscribe();
    };
  
    checkAuth();
  }, []);

  if (isChecking) return null; // Prevent UI rendering until auth is checked

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="cabinet"
        options={{
          title: "Medication",
          tabBarIcon: ({ color }) => <MaterialIcons name="medication" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}
