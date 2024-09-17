"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormCreation from "../CustomFormCreation"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"
import { registerPatient } from "@/lib/actions/paitent.actions"





export enum FormFieldTypes {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton"
    

}



const RegisterForm = ({user} : {user : User}) => {
    const router = useRouter()
    
    const [isLoading, setIsLoading] = useState(false)
    
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        
        resolver: zodResolver(PatientFormValidation),
            defaultValues: {
                ...PatientFormDefaultValues,
                name: "",
                email: "",
                phoneInput: "",
            },
    })
 

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true)

    let formData;

    if(values.identificationDocument &&values.identificationDocument.length > 0){
        const blobfile = new Blob([values.identificationDocument[0]], {type: values.identificationDocument[0].type,})

        formData = new FormData()
        formData.append("blobFile", blobfile)
        formData.append("fileName", values.identificationDocument[0].name)
    }

    try{
        const paitentData = {
            ...values,
            userId: user.$id,
            birthDate: new Date(values.birthDate),
            identificationDocument: formData,
        }
        // @ts-ignore
        const paitent = await registerPatient(paitentData)

        if(paitent){
            router.push(`/patients/${user.$id}/new-appointment`)
        }

    }catch(error){
      console.log(error)
    }
    
  }

 
return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <section className="space-y-4">
                <h1 className="header">Welcome 👋</h1>
                <p className="text-dark-700">Let us know more about yourself.</p>
            </section>

            <section className="space-y-6">
                <div className="mb-9 space-y-1">
                    <h2 className="sub-header">Personal Information</h2>
                </div>
            </section>
            <CustomFormCreation
                control={form.control}
                fieldType={FormFieldTypes.INPUT}
                name="name"
                label="full name"
                placeholder="John Doe"
                iconSrc="/assets/icons/user.svg"
                iconAlt="user icon"
            />

            <div className="flex flex-col gap-6 xl:flex-row ">
                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.INPUT}
                    name="email"
                    label="Email"
                    placeholder="johndoe@gmail.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="user icon"
                />
                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.PHONE_INPUT}
                    name="phoneInput"
                    label="Phone Number"
                    placeholder="123-456-7890"
                />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.DATE_PICKER}
                    name="birthDate"
                    label="Date of Birth"
                />
                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.SKELETON}
                    name="gender"
                    label="Gender"
                    renderSkeleton = {(field) => (
                        <FormControl>
                            <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value} >
                                {GenderOptions.map((option) => (
                                    <div key={option} className="radio-group">
                                        <RadioGroupItem value={option} id={option} />
                                        <Label htmlFor={option} className ="cursor-pointer">
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )} 
                />
                


            </div>


            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.INPUT}
                    name="address"
                    label="Address"
                    placeholder="14th Street, New York"
                />

                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.INPUT}
                    name="occupation"
                    label="Occupation"
                    placeholder="Software Engineer"
                />
            </div>
            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.INPUT}
                    name="emergencyContactName"
                    label="Emergency Contact Name"
                    placeholder="Guardian's Name"
                />
                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.PHONE_INPUT}
                    name="emergencyContactNumber"
                    label="Emeregency Contact Number"
                    placeholder="123-456-7890"
                />
                
            </div>

            <section className="space-y-6">
                <div className="mb-9 space-y-1">
                    <h2 className="sub-header">Medical Information</h2>
                </div>
            </section>

            <CustomFormCreation
                control={form.control}
                fieldType={FormFieldTypes.SELECT}
                name="primaryPhysician"
                label="Primary Physician"
                placeholder="Select a Physician"
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

            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.INPUT}
                    name="insuranceProvider"
                    label="Insurance Provider"
                    placeholder="Blue Cross Blue Shield"
                />

                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.INPUT}
                    name="insurancePolicyNumber"
                    label="Insurance Policy Number"
                    placeholder="ABC1234567890"
                />
            </div>
            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.TEXTAREA}
                    name="allergies"
                    label="Allergies (if any)"
                    placeholder="Peanuts, Pollen, etc."
                />

                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.TEXTAREA}
                    name="currentMedication"
                    label="Current Medication"
                    placeholder="Paracetamol, etc."
                />
            </div>
            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.TEXTAREA}
                    name="familyMedicalHistory"
                    label="Family Medical History"
                    placeholder="Diabetes, Hypertension, etc."
                />

                <CustomFormCreation
                    control={form.control}
                    fieldType={FormFieldTypes.TEXTAREA}
                    name="pastMedicalHistory"
                    label="Past Medical History"
                    placeholder="Surgery, etc."
                />
            </div>


            <section className="space-y-6">
                <div className="mb-9 space-y-1">
                    <h2 className="sub-header">Idenftifcation and Verification</h2>
                </div>
            </section>

            <CustomFormCreation
                control={form.control}
                fieldType={FormFieldTypes.SELECT}
                name="identificationType"
                label="Identification Type"
                placeholder="Select an Identification Type"
            >
                {IdentificationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                        {type}
                    </SelectItem>
                ))}
            </CustomFormCreation>

            <CustomFormCreation
                control={form.control}
                fieldType={FormFieldTypes.INPUT}
                name="identificationNumber"
                label="Identification Number"
                placeholder="1234567890"
            />
            <CustomFormCreation
                control={form.control}
                fieldType={FormFieldTypes.SKELETON}
                name="identificationDocument"
                label="Scanned Copy of Identification Document"
                renderSkeleton = {(field) => (
                    <FormControl>
                        <FileUploader files={field.value} onChange={field.onChange}/>
                    </FormControl>
                )} 
            />

            <section className="space-y-6">
                <div className="mb-9 space-y-1">
                    <h2 className="sub-header">Consent and Privacy</h2>
                </div>
            </section>

            <CustomFormCreation
                fieldType = {FormFieldTypes.CHECKBOX}
                control={form.control}
                name="treatmentConsent"
                label="I consent to treatment"

            />

            <CustomFormCreation
                fieldType = {FormFieldTypes.CHECKBOX}
                control={form.control}
                name="disclosureConsent"
                label="I consent to disclosure of information"

            />

            <CustomFormCreation
                fieldType = {FormFieldTypes.CHECKBOX}
                control={form.control}
                name="privacyConsent"
                label="I consent to privacy policy"

            />


            <SubmitButton isLoading={isLoading}>
                Get Started
            </SubmitButton>
        </form>
    </Form>
);}
export default RegisterForm