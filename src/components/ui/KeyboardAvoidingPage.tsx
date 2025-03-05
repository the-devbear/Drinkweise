import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

interface KeyboardAvoidingPageProps {
  children: React.ReactNode;
}

export function KeyboardAvoidingPage({ children }: KeyboardAvoidingPageProps) {
  return (
    <SafeAreaView style={safeArea}>
      <KeyboardAvoidingView style={grow} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable onPress={Keyboard.dismiss} style={grow} android_disableSound>
          {children}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { safeArea, grow } = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  grow: { flex: 1 },
});
