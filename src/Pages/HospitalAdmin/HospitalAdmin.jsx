import React from 'react';
import { FaHospital, FaUserMd, FaUsers, FaCalendarAlt, FaFileMedical, FaCog } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">Clinic Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <FaCog className="text-xl text-gray-600 cursor-pointer" />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
          <nav className="flex flex-col gap-4 text-gray-700">
            <a href="#" className="font-semibold text-green-700">Dashboard Home</a>
            <a href="#">Manage Doctors</a>
            <a href="#">Manage Patients</a>
            <a href="#">Appointments</a>
            <a href="#">Reports</a>
            <a href="#">System Settings</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-2xl font-semibold">Welcome, Admin</h2>
            <p className="text-gray-600">Here’s an overview of the hospital’s performance and activity.</p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <StatCard icon={<FaHospital />} title="Clinics" count="5" />
            <StatCard icon={<FaUserMd />} title="Doctors" count="27" />
            <StatCard icon={<FaUsers />} title="Patients" count="312" />
            <StatCard icon={<FaCalendarAlt />} title="Appointments Today" count="48" />
            <StatCard icon={<FaFileMedical />} title="Reports" count="132" />
            <StatCard icon={<FaCog />} title="Settings" count="-" />
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-4">
              <ActivityLog item="Dr. Ahmed joined the system." time="2 hours ago" />
              <ActivityLog item="Appointment booked for patient Maria." time="4 hours ago" />
              <ActivityLog item="System backup completed." time="Yesterday" />
            </ul>
          </div>

          {/* Doctor Requests */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">Pending Doctor Approvals</h3>
            <ul className="space-y-4">
              <DoctorRequest name="Dr. Hassan Ali" specialty="Dermatologist" status="Pending" />
              <DoctorRequest name="Dr. Saira Khan" specialty="Pediatrician" status="Pending" />
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, count }) => (
  <div className="bg-white rounded-xl p-4 flex flex-col items-center shadow hover:shadow-md transition">
    <div className="text-green-600 text-3xl mb-2">{icon}</div>
    <p className="text-lg font-medium">{count}</p>
    <p className="text-sm text-gray-500">{title}</p>
  </div>
);

const ActivityLog = ({ item, time }) => (
  <li className="border p-4 rounded-xl shadow-sm">
    <p className="font-medium">{item}</p>
    <p className="text-sm text-gray-500">{time}</p>
  </li>
);

const DoctorRequest = ({ name, specialty, status }) => (
  <li className="border p-4 rounded-xl shadow-sm flex justify-between items-center">
    <div>
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-500">{specialty}</p>
    </div>
    <span className="text-yellow-600 font-medium">{status}</span>
  </li>
);

export default AdminDashboard;
