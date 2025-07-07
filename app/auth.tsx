import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("");
    //esto lo usamos por ejemplo para el error de que no llevaron los campos, trae colores y estilos para eso, lo aplicamos en los styles del error
    const theme = useTheme();
    const router = useRouter();

    const {signUp, signIn} = useAuth();

    const handleAuth = async ()=>{
        if(!email || !password){
            setError("Please fill all fields");
            return;
        }

        if (password.length < 6) {
            setError("La constraseña debe tener al menos 6 caracteres");
            return;
        }
       //aca seteamos error a null para que no se muestre el error abajo del input ya que paso los if entonces no hay error.
        setError(null);

        if(isSignUp){
            const error = await signUp(email, password);
            if(error){
                setError(error);
                return;
            }
        }else{
            const error = await signIn(email, password);
            if(error){
                setError(error);
                return;
            }
        }

        router.replace("/");
    }

    //con esta funcion se cambia el si tocamos abajo del boton sign in sing up,
    const handlerSwitchMode = () => {
        setIsSignUp((prev) => !prev);
    }
    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.content}>
                <Text style={styles.title}>{isSignUp ? "Create Account" : "Login"}</Text>

                <TextInput
                  mode="outlined"
                  label="Email"                  
                  placeholder="Email" 
                  autoCapitalize="none"
                  keyboardType="email-address" 
                  style={styles.input}
                  onChangeText={setEmail}
                />
                <TextInput 
                  label="Password"
                  mode="outlined"
                  placeholder="Password" 
                  autoCapitalize="none" 
                  secureTextEntry 
                  style={styles.input}
                  onChangeText={setPassword}
                />

                {error && <Text style={{color: theme.colors.error, marginBottom: 10}}>{error}</Text>}

                <Button
                  mode="contained"
                  onPress={handleAuth}
                  >
                    {isSignUp ? "Sign Up" : "Login"}
                </Button>

                <Button
                  mode="text"
                  onPress={handlerSwitchMode}
                  >
                    Already have an account?  {isSignUp ? "Login" : "Sign Up"}
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'auto',
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        textAlign: 'center',
        
    },
    input: {
        maxWidth: 300,
        marginBottom: 16,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    content: {
        flex: 1,
        padding:16,
        justifyContent: 'center',
    },
    error:{

    }
});

