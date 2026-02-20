// app/contact/page.tsx
import Image from 'next/image';
import { Mail, Instagram, Linkedin, Facebook } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-brand-bg">
      {/* Hero Section */}
      <div className="bg-brand-bg">
        <div className="relative min-h-[150px] md:min-h-[220px] max-w-6xl mx-auto flex items-center justify-between overflow-hidden">
          <div className="font-draplink font-bold text-brand-brown leading-none text-5xl sm:text-6xl md:text-7xl lg:text-8xl relative z-10 pl-4 sm:pl-8 lg:pl-0">
            <h1>Contact</h1>
            <h1>Us</h1>
          </div>

          {/* Bear poking out */}
          <div className="absolute right-0 bottom-[-60px] sm:bottom-[-80px] md:bottom-[-100px] sm:right-4 md:right-10 select-none z-0 w-[200px] sm:w-[280px] md:w-[400px]">
            <Image
              src="/bears/running-pointing.svg"
              alt="Bear"
              width={420}
              height={420}
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="min-h-[300px] flex flex-col items-center justify-center px-6 py-10 pb-20">
        <h2 className="text-3xl font-draplink mb-8 text-brand-brown">Get in Touch</h2>

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
    </div>
  );
}