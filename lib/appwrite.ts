import { Account, Client, Databases } from "appwrite";

const client = new Client();

client
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);




// Exporta los servicios para usarlos en el resto de tu app
export const account = new Account(client);
export const databases = new Databases(client);