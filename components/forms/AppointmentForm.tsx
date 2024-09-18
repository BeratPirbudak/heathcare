
"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormCreation from "../CustomFormCreation"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FormFieldTypes } from "./PaitentForm"
import { SelectItem } from "../ui/select"
import { Doctors } from "@/constants"
import { getAppointmentSchema } from "@/lib/validation"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"


const AppointmentForm = ({userId, patientId, type, appointment, setOpen}: 
    {
        userId: string, 
        patientId: string, 
        type: "create" | "cancel" | "schedule", 
        appointment?: Appointment, 
        setOpen?:(open: boolean) => void
    }) => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  
  
  const AppointmentFormValidation = getAppointmentSchema(type)

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
        primaryPhysician: appointment && appointment.primaryPhysician,
        schedule: appointment? new Date(appointment.schedule): new Date(),
        reason: appointment ? appointment.reason : "",
        note: appointment ? appointment.note : "",
        cancellationReason: appointment && appointment.cancellationReason !== null ? appointment.cancellationReason : undefined
    },
  })
 
/* this is validation for when the form is sumbitted. You write/define your own validation for the form*/ 
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true)

    let status;

    switch(type){
        case "cancel":
            status = "cancelled"
            break;
        case "create":
            status = "pending"
            break;
        case "schedule":
            status = "scheduled"
            break;
        default:
            status = "pending"
            break;

    }

    try{
        if(type === "create" && patientId){
            const appointmentData = {
                userId,
                patient: patientId,
                primaryPhysician: values.primaryPhysician,
                schedule: new Date(values.schedule),
                reason: values.reason!,
                note: values.note,
                status : status as Status
            }
            
            const appointment = await createAppointment(appointmentData)

            if(appointment){
                form.reset();
                router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
            }

        }else{
            const appointmentToUpdate ={
                userId,
                appointmentId: appointment?.$id!,
                appointment: {
                    primaryPhysician: values?.primaryPhysician,
                    schedule: new Date(values?.schedule),
                    status: status as Status,
                    cancellationReason: values?.cancellationReason
                },
                type
            }

            const updatedAppointment = await updateAppointment(appointmentToUpdate)
            if(updatedAppointment){
                setOpen && setOpen(false);
                form.reset();

            }
        }

        
    }catch(error){
      console.error(error)
    }
    
  }

  let buttonLabel;

  switch(type){
    case "cancel":
        buttonLabel = "Cancel Appointment"
        break;
    case "create":
        buttonLabel = "Create Appointment"
        break;
    case "schedule":
        buttonLabel = "Schedule Appointment"
        break;
    default:
    break;

    }

  // what is actually shown on the screen
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
            {type === 'create' && <section className="space-y-6">
                <h1 className="header"> New Appointment </h1>
                <p className="text-dark-700">Request a new appointment in 10 seconds</p>
            </section>}

            {type !== "cancel" && (
                <>
                    <CustomFormCreation
                        control={form.control}
                        fieldType={FormFieldTypes.SELECT}
                        name="primaryPhysician"
                        label="Doctor"
                        placeholder="Select a doctor"
                    >
                        {Doctors.map((doctor) => (
                            <SelectItem key={doctor.name} value={doctor.name}>
                                <div className="flex cursor-pointer items-center gap-2">
                                    <Image
                                        src={doctor.image}
                                        height={32}
                                        width={32}
                                        alt={doctor.name}
                                        className="rounded-full border border-dark-500"
                                    />
                                    <p>{doctor.name}</p>
                                </div>
                            </SelectItem>
                        ))}
                    </CustomFormCreation>


                    <CustomFormCreation
                        control={form.control}
                        fieldType={FormFieldTypes.DATE_PICKER}
                        name="schedule"
                        label="Expected appointmentDate"
                        showTimeSelect
                        dateFormate="MM/dd/yyyy - h:mm aa"
                    />

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormCreation 
                            control={form.control}
                            fieldType={FormFieldTypes.TEXTAREA}
                            name="reason"
                            label="Reason for appointment"
                            placeholder="Enter reason for appointment"
                        />

                        <CustomFormCreation 
                            control={form.control}
                            fieldType={FormFieldTypes.TEXTAREA}
                            name="note"
                            label="Notes"
                            placeholder="Enter notes"
                        />

                    </div>

                    
                </>
            )}

            {type === "cancel" && (
                <CustomFormCreation 
                    control={form.control}
                    fieldType={FormFieldTypes.TEXTAREA}
                    name="cancellationReason"
                    label="Reason for cancellation"
                    placeholder="Enter reason for cancellation"
                />
            )}

            <SubmitButton isLoading = {isLoading} className={`${type ==='cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>
                {buttonLabel}
            </SubmitButton> 
      </form>
    </Form>
  )
}

export default AppointmentForm
