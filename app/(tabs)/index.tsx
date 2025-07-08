import { client, COMPLETIONS_COLLECTION_ID, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealtimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit, HabitCompletion } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ID, Query } from "appwrite";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";

export default function Index() {
  const {signOut, user} = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  //esto es para la librearia Swipeable
  const swipeableRef = useRef<{ [key:string]: Swipeable | null }>({});


  //Activamos la funcion fetchHabits para que se vea en esta pantalla siempre que estemos en ella.
  useEffect(() => {
    if(user){
        //para actualizar en tiempo real apenas se carga un habito
        const habitsChannel =`databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
        const habitsSubscription = client.subscribe(
          habitsChannel, 
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

        const completionsChannel =`databases.${DATABASE_ID}.collections.${COMPLETIONS_COLLECTION_ID}.documents`;
        const completionsSubscription = client.subscribe(
          completionsChannel, 
          (response: RealtimeResponse) => {
            if ( response.events.includes("databases.*.collections.*.documents.*.create")) {
              fetchTodayCompletions();
            }
          }
        );
        
        fetchHabits();
        fetchTodayCompletions();

        return () => {
          habitsSubscription();
          completionsSubscription();
        };
    }
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

  // funciones del swipeable, para el movimiento que tienen al hacer swipe a la derecha o isquierda
  const renderRightActions = () => (
    <View style={styles.swipeActionRight}>
      <MaterialCommunityIcons name="check-circle-outline" size={32} color="#fff"/>
    </View>
  )

  const renderLeftActions = () => (
    <View style={styles.swipeActionLeft}>
      <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff"/>
    </View>
  )

  //funcion que elimina un habito al hacer swipe
  const handleDeleteHabit = async (id: string) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        id,
      );
    } catch (error) {
      console.error(error);
    }
  };

  //FUNCION PARA MARCAR UN HABITO COMO COMPLETADO
  const handleCompleteHabit = async (id: string) => {
    if(!user || completedHabits.includes(id)) return;

    try {

      const currentDate= new Date().toISOString();

      await databases.createDocument(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        ID.unique(),
        {
          habit_id: id,
          user_id: user.$id,
          completed_at: currentDate,
        }
      );
      //en esta parte del codigo, encontramos el id del habito y lo actualizamos los datos que necestamos actualizar.
      const habit = habits?.find((h)=>h.$id === id);

      if(!habit) return;

      await databases.updateDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        id,
        {
          streak_count: habit.streak_count + 1,
          last_completed: currentDate,
        }
      );
     
      
    } catch (error) {
      console.error(error);
    }
  };
    
 //esta funcion muestra los habitos que delsizaron a la derecha , es decir se cumplieron 
  const fetchTodayCompletions = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
     const response = await databases.listDocuments(
      DATABASE_ID,
      COMPLETIONS_COLLECTION_ID,
      [
        Query.equal("user_id", user?.$id ?? ""), 
        Query.greaterThanEqual("completed_at", today.toISOString()),
        
      ]
     );
     const completions = response.documents as HabitCompletion[];
     setCompletedHabits(completions.map((c)=>c.habit_id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
          <Swipeable ref={(ref)=>{swipeableRef.current[habit.$id] = ref;}}
           key={key}
           overshootLeft={false}
           overshootRight={false}
           renderRightActions={renderRightActions}
           renderLeftActions={renderLeftActions}
           onSwipeableOpen={(direction) => {
            if(direction === "left"){
              handleDeleteHabit(habit.$id);
            }else if(direction === "right"){
              handleCompleteHabit(habit.$id);
            }
            swipeableRef.current[habit.$id]?.close();
           }}
           >
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
          </Swipeable>
        ))
      ) }
    </View>
    </ScrollView>    
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
    marginBottom: 8,
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
  swipeActionRight: {
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
  swipeActionLeft: {
    backgroundColor: "#f44336", 
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },
});

