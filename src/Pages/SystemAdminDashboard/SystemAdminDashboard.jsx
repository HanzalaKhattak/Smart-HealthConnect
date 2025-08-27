import React from 'react';
import { FaServer, FaUserShield, FaClinicMedical, FaUserMd, FaTools, FaChartPie } from 'react-icons/fa';

const SystemAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      {/* <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">System Admin Dashboard</h1>
        <div className="text-gray-500">Admin Panel</div>
      </header> */}

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
          <nav className="flex flex-col gap-4 text-gray-700">
            <a href="#" className="font-semibold text-green-700">Dashboard Home</a>
            <a href="#">Manage System Users</a>
            <a href="#">Clinics & Hospitals</a>
            <a href="#">Doctors</a>
            <a href="#">Logs</a>
            <a href="#">System Settings</a>
            <a href="#">Reports & Analytics</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-2xl font-semibold">Welcome, System Administrator</h2>
            <p className="text-gray-600">Here you can oversee the complete Smart HealthConnect system.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <StatCard icon={<FaUserShield />} title="System Users" count="12" />
            <StatCard icon={<FaClinicMedical />} title="Clinics Registered" count="42" />
            <StatCard icon={<FaUserMd />} title="Doctors" count="318" />
            <StatCard icon={<FaChartPie />} title="Analytics Reports" count="78" />
            <StatCard icon={<FaTools />} title="Active Logs" count="5" />
            <StatCard icon={<FaServer />} title="Servers Active" count="3" />
          </div>

          {/* System Logs */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">Recent System Logs</h3>
            <ul className="space-y-3">
              <LogEntry message="New clinic registration approved." time="2 hours ago" />
              <LogEntry message="System update deployed." time="Yesterday" />
              <LogEntry message="User permission changed by Admin." time="3 days ago" />
            </ul>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">Critical System Alerts</h3>
            <Alert message="Backup server nearing capacity." status="Warning" />
            <Alert message="Unusual login detected." status="Alert" />
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

const LogEntry = ({ message, time }) => (
  <li className="border p-4 rounded-xl shadow-sm">
    <p className="font-medium">{message}</p>
    <p className="text-sm text-gray-500">{time}</p>
  </li>
);

const Alert = ({ message, status }) => (
  <div className={`p-4 rounded-xl mb-3 ${status === 'Alert' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
    <p className="font-semibold">{message}</p>
    <p className="text-sm">Status: {status}</p>
  </div>
);

export default SystemAdminDashboard;
