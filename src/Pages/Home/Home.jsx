import React, { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaHospital, FaPills, FaRobot, FaCalendarCheck, FaQuestionCircle, FaCheckCircle, FaStar } from 'react-icons/fa';
import img1 from './HomeAssets/mandf.webp';

const AIAgent = lazy(() => import('../../Components/AIAgent/AIAgent'));
const HospNearYou = lazy(() => import('../../Components/HospitalNearYou/HospNearYou'));
const PharmasNearYou = lazy(() => import('../../Components/PharmasNearYou/PharmasNearYou'));

const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const servicesRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      const userType = localStorage.getItem('userType');
      switch(userType) {
        case 'doctor': navigate('/doctor-dashboard'); break;
        case 'hospitalAdmin': navigate('/hospital-admin'); break;
        case 'systemAdmin': navigate('/system-admin'); break;
        default: navigate('/dashboard');
      }
    } else {
      navigate('/register');
    }
  };

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  const features = [
    {
      icon: <FaUserMd className="text-4xl" />,
      title: "Find Doctors",
      description: "Connect with specialist doctors for consultations",
      path: "/find-doctors"
    },
    {
      icon: <FaRobot className="text-4xl" />,
      title: "AI Health Assistant",
      description: "Get instant health guidance with our AI system",
      path: "/ai-consultation"
    },
    {
      icon: <FaHospital className="text-4xl" />,
      title: "Nearby Hospitals",
      description: "Locate hospitals and medical facilities near you",
      path: "/find-hospitals"
    },
    {
      icon: <FaPills className="text-4xl" />,
      title: "Pharmacy Finder",
      description: "Find pharmacies and medical supplies",
      path: "/find-pharmacies"
    },
    {
      icon: <FaCalendarCheck className="text-4xl" />,
      title: "Book Appointments",
      description: "Schedule medical appointments online",
      path: "/book-appointment"
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
          <div className='flex flex-col md:flex-row items-center justify-between gap-12 md:pl-10'>
            <div className='flex flex-col items-center md:items-start text-center md:text-left max-w-xl animate-slide-up'>
              <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4'>
                We <span className='text-green-600'>Care</span> about
                <br />Your <span className='text-green-600'>Health</span>
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Access quality healthcare services from anywhere, anytime. Connect with doctors, find hospitals, and get AI-powered health guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleGetStarted}
                  className='bg-gradient-to-r from-green-600 to-green-700 text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 rounded-lg hover:scale-105 transition-all duration-200 shadow-md hover:shadow-xl'
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                </button>
                <button
                  onClick={scrollToServices}
                  className='bg-white text-green-600 border-2 border-green-600 text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 rounded-lg hover:bg-green-50 transition-all duration-200'
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className='md:w-1/2 animate-slide-up'>
              <img src={img1} alt="Healthcare Professionals" width={512} height={512} fetchPriority="high" className='w-full h-auto max-w-lg mx-auto rounded-lg shadow-lg' />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard number="500+" label="Doctors" />
          <StatCard number="50+" label="Hospitals" />
          <StatCard number="10k+" label="Patients" />
          <StatCard number="24/7" label="Support" />
        </div>
      </section>

      {/* Features Grid (Our Services) */}
      <section className="py-12 px-4 bg-gray-50" ref={servicesRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">Our Services</h2>
            <p className="text-gray-600 text-lg">Comprehensive healthcare solutions at your fingertips</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.path)}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer group hover:scale-105 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-green-600 mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <div className="mt-4 text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Explore →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Why Choose Smart HealthConnect?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard 
              icon={<FaCheckCircle className="text-4xl" />}
              title="Verified Doctors"
              description="All doctors are verified professionals with valid licenses"
            />
            <BenefitCard 
              icon={<FaRobot className="text-4xl" />}
              title="AI-Powered"
              description="Get instant health insights with our advanced AI assistant"
            />
            <BenefitCard 
              icon={<FaCalendarCheck className="text-4xl" />}
              title="Easy Booking"
              description="Book appointments in seconds, manage everything online"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Sarah Ahmed"
              role="Patient"
              content="Smart HealthConnect made it so easy to find a doctor and book an appointment. The AI assistant was very helpful!"
              rating={5}
            />
            <TestimonialCard 
              name="Dr. Khan"
              role="Cardiologist"
              content="As a doctor, this platform helps me manage my appointments efficiently and reach more patients."
              rating={5}
            />
            <TestimonialCard 
              name="Ali Hassan"
              role="Patient"
              content="The pharmacy finder feature is amazing. I can easily locate nearby pharmacies and check availability."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Quick Access Components */}
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <AIAgent />
      </Suspense>

      {/* Location-based Services */}
      <Suspense fallback={<div className="min-h-[100px]" />}>
        <HospNearYou />
        <PharmasNearYou />
      </Suspense>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 sm:p-8 md:p-12 text-center text-white shadow-xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-green-100">Join thousands of users who trust Smart HealthConnect for their healthcare needs</p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-green-600 text-lg font-semibold px-10 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Sign Up Now - It\'s Free'}
          </button>
        </div>
      </section>
    </div>
  );
};

// Component definitions
const StatCard = ({ number, label }) => (
  <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-200">
    <h3 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{number}</h3>
    <p className="text-gray-600 font-medium">{label}</p>
  </div>
);

const BenefitCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-200 group">
    <div className="text-green-600 mb-4 flex justify-center group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TestimonialCard = ({ name, role, content, rating }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
    <div className="flex items-center mb-4">
      {[...Array(rating)].map((_, i) => (
        <FaStar key={i} className="text-yellow-400" />
      ))}
    </div>
    <p className="text-gray-700 mb-4 italic">"{content}"</p>
    <div>
      <p className="font-semibold text-gray-800">{name}</p>
      <p className="text-sm text-gray-600">{role}</p>
    </div>
  </div>
);

export default Home;
