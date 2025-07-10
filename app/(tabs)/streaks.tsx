import { COMPLETIONS_COLLECTION_ID, DATABASE_ID, databases, HABITS_COLLECTION_ID } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { Habit, HabitCompletion } from '@/types/database.type';
import { Query } from 'appwrite';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';


export default function StreaksSceen() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>([]);
    const { user } = useAuth();
    const [rankedHabits, setRankedHabits] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            fetchHabits();
            fetchCompletions(); 
        }
    }, [user]);

    const fetchHabits = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                HABITS_COLLECTION_ID,
                [Query.equal("user_id", user?.$id ?? "")]
            );
            setHabits(response.documents as Habit[]);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCompletions = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COMPLETIONS_COLLECTION_ID,
                [Query.equal("user_id", user?.$id ?? "")]
            );
            const completions = response.documents as HabitCompletion[];
            setCompletedHabits(completions);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (habits.length > 0 && completedHabits.length > 0) {
            const habitStreaks = habits.map((habit) => {
                const { streak, bestStreak, total } = getStreakData(habit.$id);
                return {
                    habit,
                    streak,
                    bestStreak,
                    total,
                };
            });

            const sortedHabits = habitStreaks.sort((a, b) => b.streak - a.streak);
            setRankedHabits(sortedHabits);
        }
    }, [habits, completedHabits]);

    const getStreakData = (habitId: string) => {
        const habitCompletions = completedHabits.filter(
            (c) => c.habit_id === habitId
        ).sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());

        if (habitCompletions.length === 0) {
            return { streak: 0, bestStreak: 0, total: 0 };
        }

        let streak = 1;
        let bestStreak = 1;
        let total = habitCompletions.length;
        let lastDate: Date | null = null;
        let currentStreak = 0;

        habitCompletions.forEach((c) => {
            const date = new Date(c.completed_at);
            if (lastDate) {
                const diff = (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
                if (diff <= 1.5) {
                    currentStreak += 1;
                } else {
                    currentStreak = 1;
                }
            }
            if (currentStreak > bestStreak) {
                bestStreak = currentStreak;
                streak = currentStreak;
            }
            lastDate = date;
        });

        return { streak, bestStreak, total };
    };

    const styles = StyleSheet.create({
        container: {
            padding: 16,
        },
        card: {
            backgroundColor: '#f5f5f5',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            elevation: 2,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 8,
        },
        description: {
            marginBottom: 8,
        },
        stats: {
            fontSize: 14,
            color: '#666',
        },
    });

    return (
        <ScrollView>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.container}>
                    
                    {rankedHabits.length > 0 && (
                        <View>
                            <Text style={{marginBottom: 16}}>🏅Top Rachas</Text>
                            {rankedHabits.slice(0,3).map((item, index)=>(
                                <View key={index} style={styles.card}>
                                    <Text>{item.habit.title}</Text>                           
                                </View>
                            ))}
                        </View>
                    ) }

                    {habits.length === 0 ? (
                        <View style={styles.card}>
                            <Text style={styles.description}>No hay habitos todavia. Agrega tus primeros!</Text>
                        </View>
                    ) : (
                        rankedHabits.map(({ habit, streak, bestStreak, total }, index) => (
                            <View key={habit.$id} style={styles.card}>
                                <Text style={styles.title}>{habit.title}</Text>
                                <Text style={styles.description}>{habit.description}</Text>
                                <Text style={styles.stats}>Racha Actual: {streak}</Text>
                                <Text style={styles.stats}>Mejor Racha: {bestStreak}</Text>
                                <Text style={styles.stats}>Total Completados: {total}</Text>
                            </View>
                        ))
                    )}
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}