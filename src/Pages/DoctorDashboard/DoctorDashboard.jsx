import React from 'react';
import { FaCalendarCheck, FaUserInjured, FaComments, FaNotesMedical, FaBell, FaUserMd } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      {/* <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">Smart HealthConnect - Doctor Panel</h1>
        <div className="flex items-center gap-4">
          <button className="text-xl"><FaBell /></button>
          <button className="text-xl"><FaUserMd /></button>
        </div>
      </header> */}

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-md min-h-screen p-6 hidden md:block">
          <nav className="flex flex-col gap-4">
            <a href="#" className="text-green-600 font-semibold">Dashboard Overview</a>
            <a href="#">My Appointments</a>
            <a href="#">Patient Records</a>
            <a href="#">Messages</a>
            <a href="#">Prescriptions</a>
            <a href="#">Availability Settings</a>
            <Link to="/doctor/edit-profile" className="text-gray-700 hover:text-green-600 transition-colors">
              Edit Profile & Location
            </Link>
            <a href="#">Support</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Card */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-2xl font-semibold">Welcome back, Dr. Ali!</h2>
            <p className="text-gray-600">Here's a snapshot of your schedule and patients today.</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <ActionCard icon={<FaCalendarCheck />} label="Today's Appointments" />
            <ActionCard icon={<FaUserInjured />} label="Patient Records" />
            <ActionCard icon={<FaNotesMedical />} label="Write Prescription" />
            <ActionCard icon={<FaComments />} label="Messages" />
            <ActionCard icon={<FaCalendarCheck />} label="Set Availability" />
            <Link to="/doctor/edit-profile">
              <ActionCard icon={<FaUserMd />} label="Edit Profile & Location" />
            </Link>
          </div>

          {/* Appointments List */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
            <ul className="space-y-4">
              <AppointmentCard patient="Ahmed Raza" time="9:00 AM, May 5" reason="Follow-up" status="Confirmed" />
              <AppointmentCard patient="Zainab Fatima" time="11:30 AM, May 5" reason="New Consultation" status="Pending" />
              <AppointmentCard patient="Bilal Khan" time="2:00 PM, May 5" reason="Lab Results Review" status="Confirmed" />
            </ul>
          </div>

          {/* Recent Messages */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">Recent Messages</h3>
            <ul className="space-y-4">
              <MessageCard from="Ahmed Raza" content="Thanks for the advice, doctor!" time="2 hours ago" />
              <MessageCard from="Zainab Fatima" content="Should I take the medication at night?" time="5 hours ago" />
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

const AppointmentCard = ({ patient, time, reason, status }) => (
  <li className="border p-4 rounded-xl shadow-sm">
    <div className="flex justify-between items-center">
      <div>
        <p className="font-semibold">Patient: {patient}</p>
        <p className="text-sm text-gray-600">Time: {time}</p>
        <p className="text-sm text-gray-500">Reason: {reason}</p>
      </div>
      <span className={`text-sm font-medium ${status === 'Confirmed' ? 'text-green-600' : 'text-yellow-500'}`}>
        {status}
      </span>
    </div>
  </li>
);

const MessageCard = ({ from, content, time }) => (
  <li className="border p-4 rounded-xl shadow-sm">
    <p className="font-semibold">{from}</p>
    <p className="text-gray-700">{content}</p>
    <p className="text-xs text-gray-500">{time}</p>
  </li>
);

export default DoctorDashboard;
