import { Redirect, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  return (
   <View>
    <Text>Home Screen</Text>
    <Redirect href={'/login'}/>
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
