"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormCreation from "../ui/CustomFormCreation"
import { Button } from "@/components/ui/button"



export enum FormFieldTypes {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton"

}



/* this part of my import is used to validate the fields of the form themsevles using zodResolvers features.
   For example the schema literally refering to the schematics. This is things like the username field must contain 
   x number of characters for it to be valid... */
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

/* This part is generally reffering to the form itself. This is wear you create the form fields.*/
const PaitentForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
 
/* this is validation for when the form is sumbitted. You write/define your own validation for the form*/ 
  function onSubmit(values: z.infer<typeof formSchema>) {

    console.log(values)
  }

  // what is actually shown on the screen
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
            <section className="space-y-6 mb-12">
                <h1 className="header">Welcome to CarePlus 👋</h1>
                <p className="text-dark-700">sign in to schedule your first appointment</p>
                <CustomFormCreation 
                    control = {form.control}
                    fieldType  = {FormFieldTypes.INPUT}
                    name = "name"
                    label = "full name"
                    placeholder = "John Doe"
                    iconSrc = "assets/icons/user.svg"
                    iconAlt = "user icon"
                />
                <CustomFormCreation 
                    control = {form.control}
                    fieldType  = {FormFieldTypes.INPUT}
                    name = "email"
                    label = "Email"
                    placeholder = "johndoe@gmail.com"
                    iconSrc = "assets/icons/email.svg"
                    iconAlt = "user icon"
                />
                <CustomFormCreation 
                    control = {form.control}
                    fieldType  = {FormFieldTypes.PHONE_INPUT}
                    name = "phoneInput"
                    label = "Phone Number"
                    placeholder = "123-456-7890"
                />
            </section>  
            <Button type="submit">Submit</Button>  
        </form>
    </Form>
  )
}

export default PaitentForm