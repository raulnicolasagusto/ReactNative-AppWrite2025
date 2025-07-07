import { ID, Models } from "appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "./appwrite";
//definimos el tipo de AuthContext porque estamos con typescript
type AuthContextType = {
    user: Models.User<Models.Preferences> | null;
    isLoadingUser: boolean;
    signUp: (email:string, password:string) => Promise<string | null>;
    signIn: (email:string, password:string) => Promise<string | null>;
    signOut: () => Promise<void>;
    
}
    

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//esta funcion es un hook wrapper component asique tenemos que poner children dentro
export function AuthProvider({children}: {children: React.ReactNode}){
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

    useEffect(() => {
        getUser();
    }, []);
    
    const getUser = async () => {
        try {
            const session = await account.get();
            setUser(session);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoadingUser(false);
        }
    }

    //Esta funcion la llamamos del archivo auth.tsh , es la funcion handelAuth.
    const signUp = async (email:string, password:string) => {
        try {
            await account.create(ID.unique(), email, password);//creamos account en appwrite.ts , esto va a crear un usuario en la app
            await signIn(email, password);
            return null;
        } catch (error) {
            if(error instanceof Error){
                return error.message;
            }
            return "Ocurrio un error al crear el usuario";
        }
    }

    const signIn = async (email:string, password:string) => {
        try {
            await account.createEmailPasswordSession(email, password);
            const session = await account.get();
            setUser(session);
            return null;
        } catch (error) {
            if(error instanceof Error){
                return error.message;
            }
            return "Ocurrio un error al iniciar sesión";
        }
    }
    const signOut = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        //al value le pasamos un objetct que debe incluir usuario, signUp, signIn
        <AuthContext.Provider value={{user,signUp, signIn, signOut, isLoadingUser}}>
            {children}
        </AuthContext.Provider>
    )
}

//con esto podemos llamar a las funciones signUp y signIn desde cualquier componente
export function useAuth(){
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be dentro del authprivder");
    }
    return context;
}

