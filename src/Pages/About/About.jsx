import React from 'react';
import { FaUserMd, FaHeartbeat, FaLaptopMedical, FaLanguage, FaHospital, FaPills, FaRobot, FaShieldAlt, FaUsers, FaAward, FaCheckCircle, FaLightbulb, FaHandHoldingHeart } from 'react-icons/fa';

const features = [
  { 
    title: "Doctor Discovery", 
    icon: <FaUserMd />,
    description: "Find and connect with verified healthcare professionals"
  },
  { 
    title: "AI Health Assistant", 
    icon: <FaRobot />,
    description: "Get instant health insights powered by advanced AI"
  },
  { 
    title: "Appointment Booking", 
    icon: <FaLaptopMedical />,
    description: "Schedule appointments seamlessly online"
  },
  { 
    title: "Pharmacy Finder", 
    icon: <FaPills />,
    description: "Locate nearby pharmacies and order medicines"
  },
  { 
    title: "Hospital Network", 
    icon: <FaHospital />,
    description: "Access to 50+ partner hospitals nationwide"
  },
  { 
    title: "Secure & Private", 
    icon: <FaShieldAlt />,
    description: "Your health data is encrypted and protected"
  },
];

const values = [
  {
    icon: <FaHandHoldingHeart className="text-5xl" />,
    title: "Patient-Centered Care",
    description: "Everything we do is focused on improving patient experience and outcomes"
  },
  {
    icon: <FaLightbulb className="text-5xl" />,
    title: "Innovation",
    description: "Leveraging cutting-edge technology to solve healthcare challenges"
  },
  {
    icon: <FaShieldAlt className="text-5xl" />,
    title: "Trust & Security",
    description: "Maintaining the highest standards of data privacy and security"
  },
  {
    icon: <FaUsers className="text-5xl" />,
    title: "Accessibility",
    description: "Making quality healthcare accessible to everyone, everywhere"
  }
];

const About = () => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 min-h-screen animate-fade-in">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 animate-slide-up">
            About Smart HealthConnect
          </h1>
          <p className="text-base sm:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
            A smart, AI-driven healthcare platform that connects people to doctors, pharmacies, and health resources — instantly and intelligently.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Our Story */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Smart HealthConnect was born from a simple yet powerful idea: healthcare should be accessible to everyone, regardless of their location or circumstances. We recognized the challenges people face in finding reliable healthcare information, connecting with qualified doctors, and managing their health effectively.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Today, we're proud to serve thousands of patients, partner with hundreds of verified healthcare professionals, and continuously innovate to make healthcare more accessible, efficient, and patient-friendly.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 group hover:scale-105"
              >
                <div className="text-green-600 text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-md">
              <div className="flex items-center mb-4">
                <FaAward className="text-green-600 text-4xl mr-4" />
                <h2 className="text-3xl font-bold text-green-700">Our Mission</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                To revolutionize healthcare access through digital innovation, empowering individuals with AI-powered tools, seamless doctor connectivity, and comprehensive health resources that serve both urban and remote communities equally.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-md">
              <div className="flex items-center mb-4">
                <FaLightbulb className="text-blue-600 text-4xl mr-4" />
                <h2 className="text-3xl font-bold text-blue-700">Our Vision</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                To become the most trusted healthcare platform nationwide, building a connected, intelligent, and inclusive health ecosystem that makes quality healthcare accessible to every individual, everywhere.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 text-center"
              >
                <div className="text-green-600 mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* User Roles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Who We Serve</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <RoleCard 
              title="Patients"
              icon={<FaUsers className="text-4xl" />}
              features={[
                "Search and connect with verified doctors",
                "Get AI-powered health recommendations",
                "Book appointments instantly",
                "Find nearby pharmacies and hospitals",
                "Access your health records anytime"
              ]}
            />
            <RoleCard 
              title="Doctors"
              icon={<FaUserMd className="text-4xl" />}
              features={[
                "Manage your professional profile",
                "Handle appointments efficiently",
                "Connect with more patients",
                "Share health content and tips",
                "Track your practice analytics"
              ]}
            />
            <RoleCard 
              title="Hospital Admins"
              icon={<FaHospital className="text-4xl" />}
              features={[
                "Oversee doctor schedules",
                "Manage hospital resources",
                "Integrate pharmacy services",
                "Monitor patient flow",
                "Access administrative tools"
              ]}
            />
            <RoleCard 
              title="System Admins"
              icon={<FaShieldAlt className="text-4xl" />}
              features={[
                "Manage platform operations",
                "Monitor system health",
                "Handle user accounts",
                "Ensure data security",
                "Generate system reports"
              ]}
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 sm:p-12 text-white shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-5xl font-bold mb-2">500+</div>
                <div className="text-green-100 text-sm sm:text-base">Verified Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-5xl font-bold mb-2">50+</div>
                <div className="text-green-100 text-sm sm:text-base">Partner Hospitals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-5xl font-bold mb-2">10,000+</div>
                <div className="text-green-100 text-sm sm:text-base">Happy Patients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-5xl font-bold mb-2">24/7</div>
                <div className="text-green-100 text-sm sm:text-base">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Vision */}
        <section className="text-center bg-white rounded-2xl shadow-lg p-6 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Looking Ahead</h2>
          <p className="text-gray-700 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6">
            As we grow, Smart HealthConnect envisions expanding our nationwide presence, partnering with more healthcare providers, and continuously enhancing our AI capabilities to build a truly connected, intelligent, and inclusive health ecosystem for all.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-green-50 px-6 py-3 rounded-lg">
              <FaCheckCircle className="text-green-600" />
              <span className="text-gray-700 font-medium">AI Innovation</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-6 py-3 rounded-lg">
              <FaCheckCircle className="text-green-600" />
              <span className="text-gray-700 font-medium">Rural Healthcare</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-6 py-3 rounded-lg">
              <FaCheckCircle className="text-green-600" />
              <span className="text-gray-700 font-medium">Telemedicine</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-6 py-3 rounded-lg">
              <FaCheckCircle className="text-green-600" />
              <span className="text-gray-700 font-medium">Health Records</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Component for Role Cards
const RoleCard = ({ title, icon, features }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
    <div className="flex items-center mb-4">
      <div className="text-green-600 mr-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    </div>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start text-gray-700">
          <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default About;
