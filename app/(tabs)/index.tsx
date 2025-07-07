import { useAuth } from "@/lib/auth-context";
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";


export default function Index() {
  const {signOut, user} = useAuth();
  return (
    <View
      style={styles.container}
    >
      <Text>buenvenido:{user?.email}</Text>
      <Link href="/login" style={styles.link}>Ir a Login</Link>
      <Button
        mode="contained"
        onPress={signOut}
        icon="logout"
        >Cerrar Sesion
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  link: {
    color: "blue",
    backgroundColor:"brown",
    height: 50,
    width: 200,
    textAlign: "center",
    fontSize: 20,
    borderRadius: 10
  }
});