import * as sdk from 'node-appwrite';

const {
    PROJECT_ID, DATABASE_ID, PAITENT_COLLECTION_ID, DOCTOR_COLLECTION_ID, APPOINTMENT_COLLECTION_ID, API_KEY,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT
} = process.env;

const client: sdk.Client = new sdk.Client();

client
    .setEndpoint(ENDPOINT!) // exclimation mark to let it known it actually exists
    .setProject(PROJECT_ID!)
    .setKey(API_KEY!);

    export const database = new sdk.Databases(client);
    export const storage = new sdk.Storage(client);
    export const users = new sdk.Users(client);
    export const messaging = new sdk.Messaging(client);

