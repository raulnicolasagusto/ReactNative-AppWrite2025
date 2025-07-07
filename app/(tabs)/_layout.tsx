import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
      headerStyle: { backgroundColor: "#f5f5f5"},
       headerShadowVisible: false,
       tabBarStyle:{
        backgroundColor: "#f5f5f5",
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
       },
       tabBarActiveTintColor: "#6200ee",
       tabBarInactiveTintColor: "#66666",
       }}>
      <Tabs.Screen 
      name="index" 
      options={{ title:"Habitos de hoy", tabBarIcon: ({ color, focused }) =>
      <MaterialCommunityIcons name="calendar-today" size={24} color={color} />
      }} />
      <Tabs.Screen name="streaks" options={{ title:"Rachas", tabBarIcon: ({ color, focused }) =>
       <MaterialCommunityIcons name="chart-line" size={24} color={color} />
      }} />
      <Tabs.Screen name="add-habbit" options={{ title:"Agregar Habito", tabBarIcon: ({ color, focused }) =>
       <MaterialCommunityIcons name="plus-circle" size={24} color={color} />
      }} />
    </Tabs> 
  );
}

