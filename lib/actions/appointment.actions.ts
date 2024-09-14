"use server"

import { ID, Query } from "node-appwrite"
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config"
import { parseStringify } from "../utils"
import { Appointment } from "@/types/appwrite.types"

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try{
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        )

        return parseStringify(newAppointment)
    }catch (error){
        console.log(error)
    }
}

export const getAppointments = async (appointmentId: string) => {
    try{
        const appointments = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        )

        return parseStringify(appointments)
    }catch (error){
        console.log(error)
    }
}

export const getRecentAppointmentList = async () => {
    try{
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        const initialCounts = {
            scheduled: 0,
            pending: 0,
            cancelled: 0
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if(appointment.status === 'scheduled'){
                acc.scheduled += 1
            }else if(appointment.status === 'pending'){
                acc.pending += 1
            }else if(appointment.status === 'cancelled'){
                acc.cancelled += 1
            }

            return acc;
        }, initialCounts);
        

        const data ={
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }


        return parseStringify(data)

    }catch(error){
        console.log(error)
    }
}