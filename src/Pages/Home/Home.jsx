import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaHospital, FaPills, FaRobot, FaCalendarCheck, FaQuestionCircle } from 'react-icons/fa';
import img1 from './HomeAssets/mandf.png';
import AIAgent from '../../Components/AIAgent/AIAgent';
import BookAppointment from '../../Components/BookAppointment';
import HospNearYou from '../../Components/HospitalNearYou/HospNearYou';
import ShowCard from '../../Components/Specialization Cards/ShowCard';
import PharmasNearYou from '../../Components/PharmasNearYou/PharmasNearYou';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaUserMd className="text-4xl" />,
      title: "Find Doctors",
      description: "Connect with specialist doctors for consultations",
      path: "/specializations"
    },
    {
      icon: <FaRobot className="text-4xl" />,
      title: "AI Health Assistant",
      description: "Get instant health guidance with our AI system",
      path: "/ai"
    },
    {
      icon: <FaHospital className="text-4xl" />,
      title: "Nearby Hospitals",
      description: "Locate hospitals and medical facilities near you",
      path: "/hospital-near-you"
    },
    {
      icon: <FaPills className="text-4xl" />,
      title: "Pharmacy Finder",
      description: "Find pharmacies and medical supplies",
      path: "/pharmas"
    },
    {
      icon: <FaCalendarCheck className="text-4xl" />,
      title: "Book Appointments",
      description: "Schedule medical appointments online",
      path: "/appointment"
    },
    {
      icon: <FaQuestionCircle className="text-4xl" />,
      title: "Help & Support",
      description: "Get answers to your questions",
      path: "/faq"
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-md my-5 overflow-hidden'>
        <div className='container mx-auto px-4 py-12 md:py-20'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
            <div className='flex flex-col items-center md:items-start text-center md:text-left max-w-xl'>
              <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4'>
                We <span className='text-green-600'>Care</span> about
                <br />Your <span className='text-green-600'>Health</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Access quality healthcare services from anywhere, anytime. Connect with doctors, find hospitals, and get AI-powered health guidance.
              </p>
              <button
                onClick={() => navigate('/specializations')}
                className='bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:scale-105 transition-all duration-200 shadow-md'
              >
                Get Started
              </button>
            </div>
            <div className='md:w-1/2'>
              <img src={img1} alt="Healthcare Professionals" className='w-full h-auto max-w-lg mx-auto rounded-lg shadow-lg' />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-green-600 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access Components */}
      <span className='flex flex-col md:flex-row items-center justify-evenly gap-6 my-8'>
        <AIAgent />
        <BookAppointment />
      </span>

      {/* Location-based Services */}
      <div className="space-y-8 mb-12">
        <HospNearYou />
        <PharmasNearYou />
      </div>

      {/* Doctor Specializations */}
      <ShowCard />
    </div>
  );
};

export default Home;