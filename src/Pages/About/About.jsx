import React from 'react';
import { FaUserMd, FaHeartbeat, FaLaptopMedical, FaLanguage } from 'react-icons/fa';

const features = [
  { title: "Doctor Discovery", icon: <FaUserMd /> },
  { title: "AI Symptom Checker", icon: <FaHeartbeat /> },
  { title: "Appointment Booking", icon: <FaLaptopMedical /> },
  { title: "Multilingual Interface", icon: <FaLanguage /> },
];

const About = () => {
  return (
    <div className="bg-white min-h-screen py-12 px-6 lg:px-24">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-green-600 mb-4">
            About Smart Health-Connect
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            A smart, AI-driven healthcare platform that connects people to doctors, pharmacies, and health resources — instantly and intelligently.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-6 text-center shadow hover:shadow-lg transition">
              <div className="text-green-500 text-3xl mb-3 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-green-700">{feature.title}</h3>
            </div>
          ))}
        </div>

        {/* Mission */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Our Mission</h2>
          <p className="text-gray-700 text-base leading-relaxed">
            Smart Health-Connect is dedicated to revolutionizing healthcare access through digital innovation. By empowering users with AI tools, easy doctor discovery, multilingual access, and smart pharmacy services, we aim to serve urban and remote communities equally.
          </p>
        </section>

        {/* User Roles */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-green-600 mb-4">User Roles</h2>
          <ul className="space-y-3 text-gray-700 text-base pl-5 list-disc">
            <li><strong>Patient:</strong> Search doctors, get AI recommendations, book appointments, and order medicines.</li>
            <li><strong>Doctor:</strong> Manage profiles, appointments, and share health content with patients.</li>
            <li><strong>Clinic Admin:</strong> Oversee doctor schedules and local pharmacy integration.</li>
            <li><strong>System Admin:</strong> Manage all platform data, users, and system operations.</li>
          </ul>
        </section>

        {/* Future Vision */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Looking Ahead</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            As we grow, Smart Health-Connect envisions a nationwide presence — building a connected, intelligent, and inclusive health ecosystem for all.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
