import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import '../global.css';
import { PortalHost } from '@rn-primitives/portal';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'login',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutWrapper />;
}

function useProtectedRoute(user: any, isLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inAdminPage = segments[0] === 'admin';

    if (!user && (inAuthGroup || inAdminPage)) {
      // Rediriger vers login si pas authentifié
      router.replace('/login' as any);
    } else if (user && !inAuthGroup && !inAdminPage) {
      // Rediriger selon le rôle de l'utilisateur
      if (user.isManager) {
        router.replace('/admin' as any);
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [user, segments, isLoading]);
}

function RootLayoutNav() {
  const { user, isLoading } = useAuth();

  useProtectedRoute(user, isLoading);

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

function RootLayoutWrapper() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="dark"/>
        <RootLayoutNav />
        <PortalHost />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
