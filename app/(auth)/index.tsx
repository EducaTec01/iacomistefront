import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useAppFonts } from '@/hooks/useAppFonts';
import Colors from '@/constants/Colors';

export default function AuthLoadingScreen() {
  const { session, isLoading } = useAuth();
  const { appIsReady } = useAppFonts();

  useEffect(() => {
    if (appIsReady && !isLoading) {
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [session, isLoading, appIsReady]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary.default} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
  },
});