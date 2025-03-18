import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Save data to AsyncStorage.
 * @param {string} key - Storage key.
 * @param {any} value - Data to store (will be JSON stringified).
 */
export const setLocalStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving data to local storage:", error);
  }
};

/**
 * Retrieve data from AsyncStorage.
 * @param {string} key - Storage key.
 * @returns {any | null} - Parsed JSON data or null if not found.
 */
export const getLocalStorage = async (key) => {
  try {
    const result = await AsyncStorage.getItem(key);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    console.error("Error retrieving data from local storage:", error);
    return null;
  }
};

/**
 * Remove a specific key from AsyncStorage.
 * @param {string} key - Storage key to remove.
 */
export const removeLocalStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing item from local storage:", error);
  }
};

/**
 * Clear all AsyncStorage data. (Use with caution)
 */
export const clearLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing local storage:", error);
  }
};
