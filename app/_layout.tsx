import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
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

export default function RootLayout() {
  return (
    <AuthProvider>
        <RouteGuard>
          <Stack>
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </RouteGuard>
     
    </AuthProvider>
  );
}
