// app/contact/page.tsx
import Image from 'next/image';
import { Mail, Instagram, Linkedin, Facebook } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-brand-bg">
      {/* Hero Section */}
      <div className="bg-brand-bg">
        <div className="max-w-6xl h-30 lg:h-55 mx-auto flex items-center justify-between relative overflow-visible">
          <div className="relative z-20 pl-4 lg:pl-0 lg:mt-10 ">
            <div className="font-draplink font-bold text-brand-brown leading-none text-5xl lg:text-8xl">
              <h1>CONTACT US</h1>
            </div>
          </div>

          {/* Bear image */}
          <div className="absolute right-2 lg:right-20 -bottom-2 lg:-bottom-4 select-none z-10 w-25 lg:w-45">
            <Image
              src="/bears/guitar_bear.svg"
              alt="Bear playing guitar"
              width={240}
              height={291.05}
              className="object-contain w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-0">
        <hr className="border-brand-brown/30" />
      </div>

      {/* Contact Info Section */}
      <div className="min-h-[300px] flex flex-col items-center justify-center px-6 py-10 pb-20">
        <h2 className="text-3xl font-neue-haas font-medium mb-8 text-brand-brown">Get in Touch!</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl w-full">
          {/* Email */}
          <a
            href="mailto:tansa.ausa@gmail.com"
            className="flex items-center gap-4 p-4 bg-brand-pink rounded-2xl shadow hover:shadow-lg transition"
          >
            <Mail className="text-white w-8 h-8" />
            <span className="font-bold text-white text-lg">tansa.ausa@gmail.com</span>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/tansa.uoa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-brand-green rounded-2xl shadow hover:shadow-lg transition"
          >
            <Instagram className="text-white w-8 h-8" />
            <span className="font-bold text-white text-lg">@tansa.uoa</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/taiwanese-newzealand-students-association"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-brand-blue rounded-2xl shadow hover:shadow-lg transition"
          >
            <Linkedin className="text-white w-8 h-8" />
            <span className="font-bold text-white text-lg">LinkedIn</span>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/TANSA.UoA"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-brand-orange rounded-2xl shadow hover:shadow-lg transition"
          >
            <Facebook className="text-white w-8 h-8" />
            <span className="font-bold text-white text-lg">Facebook</span>
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-0">
        <hr className="border-brand-brown/30" />
      </div>
    </div>
  );
}