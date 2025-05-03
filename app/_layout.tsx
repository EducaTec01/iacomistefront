import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/context/AppContext';
import { useAppFonts } from '@/hooks/useAppFonts';
import { AuthProvider } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function RootLayout() {
  useFrameworkReady();
  const { appIsReady } = useAppFonts();

  return (
    <AuthProvider>
      <AppProvider>
        <Stack screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: Colors.neutral[50] }
        }}>
          {appIsReady && (
            <>
              <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
              <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
              <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
              <Stack.Screen name="recipe/[id]" options={{ 
                headerShown: true,
                headerTitle: '',
                headerTransparent: true,
                headerTintColor: Colors.neutral.white,
              }} />
            </>
          )}
        </Stack>
        <StatusBar style="auto" />
      </AppProvider>
    </AuthProvider>
  );
}