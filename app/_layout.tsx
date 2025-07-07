import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../lib/auth-context";


function RouteGuard({children}: {children: React.ReactNode}) {
   const router = useRouter();
   const {user, isLoadingUser} = useAuth();
   const segments = useSegments();

   useEffect(() => {
    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace("/auth");
    } else if (user && inAuthGroup && !isLoadingUser) {
      router.replace("/");
    }
   }, [user, router, segments, isLoadingUser]);

   // Show loading state while checking authentication
   if (isLoadingUser) {
     return (
       <View style={styles.loadingContainer}>
         <Text>Loading...</Text>
       </View>
     );
   }

   return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//se Agrega esto ya que al PaperProvider y SafeAreaProvider me cambio los colores del login y registro
//asique tuve que agregar este theme para que queden los colores originales
//esto es lo que me respondio el chat:This is happening because PaperProvider from react-native-paper applies its own default theme which changes the styling of input components and text. Let me check your auth.tsx file to see the current styling and fix this issue.
const theme = {
  colors: {
    primary: '#6200ee',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    onSurface: '#000000',
    disabled: '#9e9e9e',
    placeholder: '#9e9e9e',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    error: '#b00020',
  },
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <RouteGuard>
            <Stack>
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </RouteGuard> 
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
