import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { ID } from 'appwrite';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';

const FREQUENCIES = ["daily", "weekly", "monthly"];
type Frequency = (typeof FREQUENCIES)[number];

const FREQUENCIESNames = {
    daily: "Diario",
    weekly: "Semanal",
    monthly: "Mensual"
};

export default function AddHabbitScreen() {
    const [selectedFrequency, setSelectedFrequency] = useState<string>("daily");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [frequency, setFrequency] = useState<Frequency>("daily");
    const {user} = useAuth();
    const router = useRouter();
    const [error, setError] = useState<string | null>("");
    const theme = useTheme();

//AGREGAMOS A LA BASE DE DATOS APPWRITE 
    const handleSubmit = async () => {

     try {
        if(!user) return;
            
            await databases.createDocument(
                DATABASE_ID,
                HABITS_COLLECTION_ID,
                ID.unique(),
                {
                    user_id: user.$id,
                    title,
                    description,
                    frequency,
                    streak_count: 0,
                    last_completed: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                }
            );

            // Cuando se agregan los datos a la tabla, volvemos a la pantalla principal
            router.back();

        } catch (error) {
            if(error instanceof Error){
                setError(error.message);
                return;
            }
            setError("Ocurrio un error al agregar el habito");
        }
    }
 // fin AGREGAMOS A LA BASE DE DATOS APPWRITE 
    return (
        <View style={styles.container}>
            <TextInput label="Nombre del habito" mode="outlined" value={title} onChangeText={setTitle} />
            <TextInput label="Descripcion" mode="outlined" value={description} onChangeText={setDescription} />
             <View>
                <SegmentedButtons
                    value={frequency}                    
                    onValueChange={(value) =>setFrequency(value as Frequency)}
                    buttons={FREQUENCIES.map((freq) => ({
                        value: freq,
                        label: FREQUENCIESNames[freq as keyof typeof FREQUENCIESNames],
                    }))}
                
                />
            </View>
            <Button style={styles.button} mode="contained" onPress={handleSubmit} disabled={!title || !description }>Agregar Habito</Button>
            {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",

    },
    button: {
        marginTop: 16,
        backgroundColor: "#6200ee",
    },
});
