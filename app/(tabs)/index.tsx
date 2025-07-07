import { client, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealtimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Query } from "appwrite";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";

export default function Index() {
  const {signOut, user} = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);


  //Activamos la funcion fetchHabits para que se vea en esta pantalla siempre que estemos en ella.
  useEffect(() => {
    
    //para actualizar en tiempo real apenas se carga un habito
    const channel =`databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
    const habitsSubscription = client.subscribe(
      channel, 
      (response: RealtimeResponse) => {
        if ( response.events.includes("databases.*.collections.*.documents.*.create")) {
          fetchHabits();
        }else if ( response.events.includes("databases.*.collections.*.documents.*.update")) {
          fetchHabits();
        }else if ( response.events.includes("databases.*.collections.*.documents.*.delete")) {
          fetchHabits();
        }
      }
    );
    
    fetchHabits();

    return () => {
      habitsSubscription();
    };

  }, [user]);
//MOSTRAMOS LA LISTA DE HABITOS DE LA BASE DE DATOS APPWRITE
  const fetchHabits = async () => {
    try {
     const response = await databases.listDocuments(
      DATABASE_ID,
      HABITS_COLLECTION_ID,
      [
        Query.equal("user_id", user?.$id ?? "")
      ]
     );
     
     setHabits(response.documents as Habit[]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    
    <View
      style={styles.container}
    >
      <View style={styles.header}>
        
          
        
        
        <Button
          mode="contained"
          onPress={signOut}
          icon="logout"
          >Cerrar Sesion
        </Button>
      </View>

      {habits.length === 0 ? (
      
        <Text style={styles.emptyStateText} variant="bodyMedium">No tienes habitos, Agrega tus primeros</Text>
      ) : (
        habits.map((habit, key) => (
          <Surface key={key} style={styles.card}>
            <View style={styles.cardContent}>
              <Text variant="bodyMedium" style={styles.cardTitle}>{habit.title}</Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>{habit.description}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.streakBadge}>
                  <MaterialCommunityIcons name="fire" size={18} color={"#ff9800"}/>
                  <Text style={styles.streakText} variant="bodyMedium">{habit.streak_count} dias de racha</Text>
                </View>
                <View style={styles.frequencyBadge}>
                  <Text style={styles.frequencyText} variant="bodyMedium">{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</Text>
                </View>
              </View>
            </View>
          </Surface>
        ))
      ) }
    </View>
    
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",

  },

  
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24
  },
  title: {
    fontWeight: "bold",
    
    
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  },
  emptyStateText: {
    color:"#666666",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  card:{
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  cardContent: {
    padding: 20,
    
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 4,
    color:"#2223b"
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color:"#6c6c80"
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    
  },
  streakText: {
    fontWeight: "bold",
    fontSize: 15,
    color:"#ff9800",
    
  },
  frequencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    
  },
  frequencyText: {
    fontWeight: "bold",
    fontSize: 14,
    color:"#7c4dff",
    
    
  },
});