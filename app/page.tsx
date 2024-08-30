import PaitentForm from "@/components/forms/PaitentForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="paitent"
            className="mb-12 h-10 w-fit"
          />
          <PaitentForm />
          <div className="text-14-regular mt-20 flex justify-between">
            <p className=""> 
              © 2024 careplus 
            </p>

            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
          
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png" 
        height={1000}
        width={1000}
        alt="doctor image"
        className="max-w-[50%] h-auto"
      />
    </div>
  );
}
