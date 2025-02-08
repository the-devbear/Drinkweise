import { ScreenContent } from '@drinkweise/components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';


export default function Modal() {
  return (
    <>
      <ScreenContent path='app/modal.tsx' title='Modal' />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  );
}
