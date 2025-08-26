import React from 'react';
import { FaStethoscope, FaUserMd, FaPills, FaHeartbeat, FaBell, FaUserCircle } from 'react-icons/fa';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">Smart HealthConnect</h1>
        <div className="flex items-center gap-4">
          <button className="text-xl"><FaBell /></button>
          <button className="text-xl"><FaUserCircle /></button>
        </div>
      </header> */}

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-md min-h-screen p-6 hidden md:block">
          <nav className="flex flex-col gap-4">
            <a href="#" className="text-green-600 font-semibold">Dashboard Overview</a>
            <a href="#">Find Doctors</a>
            <a href="#">AI Symptom Checker</a>
            <a href="#">My Appointments</a>
            <a href="#">Pharmacy & Orders</a>
            <a href="#">Health Feed</a>
            <a href="#">Support / Contact Us</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Card */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-2xl font-semibold">Welcome back, User!</h2>
            <p className="text-gray-600">How can we assist you today?</p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">Start Symptom Check</button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <ActionCard icon={<FaHeartbeat />} label="Symptom Checker" />
            <ActionCard icon={<FaStethoscope />} label="Book Appointment" />
            <ActionCard icon={<FaPills />} label="Order Medicines" />
            <ActionCard icon={<FaUserMd />} label="Find Doctors" />
            <ActionCard icon={<FaHeartbeat />} label="Health Tips" />
            <ActionCard icon={<FaUserCircle />} label="Edit Profile" />
          </div>

          {/* Suggested Doctors */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">Suggested Doctors for You</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <DoctorCard name="Dr. Sarah Khan" specialty="Cardiologist" rating="4.8" />
              <DoctorCard name="Dr. Imran Ali" specialty="Neurologist" rating="4.7" />
              <DoctorCard name="Dr. Nadia Shah" specialty="Dermatologist" rating="4.6" />
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
            <ul className="space-y-4">
              <AppointmentCard name="Dr. Sarah Khan" time="10:00 AM, May 10" status="Confirmed" />
              <AppointmentCard name="Dr. Imran Ali" time="3:00 PM, May 12" status="Pending" />
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

const ActionCard = ({ icon, label }) => (
  <div className="bg-white rounded-xl p-4 flex flex-col items-center shadow hover:shadow-md transition">
    <div className="text-green-600 text-3xl mb-2">{icon}</div>
    <p className="text-sm text-center font-medium">{label}</p>
  </div>
);

const DoctorCard = ({ name, specialty, rating }) => (
  <div className="border p-4 rounded-xl shadow-sm hover:shadow-md transition">
    <h4 className="font-bold text-lg">{name}</h4>
    <p className="text-gray-600">{specialty}</p>
    <p className="text-yellow-500">⭐ {rating}</p>
    <button className="mt-2 px-3 py-1 bg-green-500 text-white text-sm rounded">Book Now</button>
  </div>
);

const AppointmentCard = ({ name, time, status }) => (
  <li className="border p-4 rounded-xl shadow-sm">
    <div className="flex justify-between items-center">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-600">{time}</p>
      </div>
      <span className={`text-sm font-medium ${status === 'Confirmed' ? 'text-green-600' : 'text-yellow-500'}`}>
        {status}
      </span>
    </div>
  </li>
);

export default UserDashboard;
