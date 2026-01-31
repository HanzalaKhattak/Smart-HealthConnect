import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaServer, FaUserShield, FaClinicMedical, FaUserMd, FaTools, FaChartPie,
  FaUsers, FaHospital, FaSignOutAlt, FaExclamationTriangle, FaCheck,
  FaCog, FaClipboardList, FaChartLine, FaBell, FaEdit, FaTrash, FaPlus,
  FaEye, FaDatabase, FaShieldAlt, FaCalendarAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_Doctor, API_User, API_Appointment, API_HospitalAdmin } from '../../Components/apis/apisUrl';
import { Get_All_Doctors, Get_All_Users, Get_All_Appointments, Get_All_HospitalAdmins } from '../../Components/apis/endpoints';

const SystemAdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [hospitalAdmins, setHospitalAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalHospitalAdmins: 0,
    todayAppointments: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    const username = localStorage.getItem('username');
    setAdminName(username || 'Admin');
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    let doctorsList = [];
    let usersList = [];
    let appointmentsList = [];
    let adminsList = [];
    
    try {
      // Fetch all doctors
      try {
        const doctorsRes = await axios.get(`${API_Doctor}${Get_All_Doctors}`);
        doctorsList = doctorsRes.data.Doctors || doctorsRes.data || [];
        setDoctors(doctorsList);
      } catch (err) {
        console.log('Error fetching doctors:', err);
      }
      
      // Fetch all users (patients)
      try {
        const usersRes = await axios.get(`${API_User}${Get_All_Users}`, { headers });
        usersList = usersRes.data || [];
        setPatients(usersList);
      } catch (err) {
        console.log('Error fetching patients:', err);
      }
      
      // Fetch all appointments
      try {
        const appointmentsRes = await axios.get(`${API_Appointment}${Get_All_Appointments}`);
        appointmentsList = appointmentsRes.data.appointments || appointmentsRes.data || [];
        setAppointments(appointmentsList);
      } catch (err) {
        console.log('Error fetching appointments:', err);
      }
      
      // Try to fetch hospital admins
      try {
        const adminsRes = await axios.get(`${API_HospitalAdmin}${Get_All_HospitalAdmins}`);
        adminsList = adminsRes.data || [];
        setHospitalAdmins(adminsList);
      } catch {
        console.log('Hospital admins endpoint not available');
      }
      
      // Calculate today's appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayApts = appointmentsList.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= today && aptDate < tomorrow;
      });
      
      // Calculate pending approvals
      const pendingDoctors = doctorsList.filter(doc => doc.status === 'pending' || !doc.isApproved);
      
      setStats({
        totalDoctors: doctorsList.length,
        totalPatients: usersList.length,
        totalAppointments: appointmentsList.length,
        totalHospitalAdmins: adminsList.length,
        todayAppointments: todayApts.length,
        pendingApprovals: pendingDoctors.length
      });
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getRecentAppointments = () => {
    return [...appointments]
      .sort((a, b) => new Date(b.createdAt || b.appointmentDate) - new Date(a.createdAt || a.appointmentDate))
      .slice(0, 5);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-fade-in">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen p-6 hidden md:block">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FaUserShield className="text-purple-600 text-3xl" />
              <div>
                <h2 className="font-bold text-gray-800 text-lg">{adminName}</h2>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <NavItem 
              icon={<FaChartPie />} 
              label="Dashboard" 
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <NavItem 
              icon={<FaHospital />} 
              label="Hospital Admins" 
              active={activeTab === 'hospitals'}
              onClick={() => setActiveTab('hospitals')}
            />
            <NavItem 
              icon={<FaUserMd />} 
              label="Doctors" 
              active={activeTab === 'doctors'}
              onClick={() => setActiveTab('doctors')}
            />
            <NavItem 
              icon={<FaUsers />} 
              label="Patients" 
              active={activeTab === 'patients'}
              onClick={() => setActiveTab('patients')}
            />
            <NavItem 
              icon={<FaCalendarAlt />} 
              label="Appointments" 
              active={activeTab === 'appointments'}
              onClick={() => setActiveTab('appointments')}
            />
            <NavItem 
              icon={<FaChartLine />} 
              label="Analytics" 
              active={activeTab === 'analytics'}
              onClick={() => setActiveTab('analytics')}
            />
            <NavItem 
              icon={<FaCog />} 
              label="Settings" 
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
            
            <hr className="my-4" />
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left w-full"
            >
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">System Administration</h1>
                <p className="text-gray-600 mt-1">Monitor and manage the entire Smart HealthConnect platform</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-3 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors">
                  <FaBell className="text-purple-600 text-xl" />
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {stats.pendingApprovals}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Render content based on active tab */}
          {activeTab === 'overview' && (
            <OverviewView 
              stats={stats} 
              appointments={getRecentAppointments()}
              doctors={doctors}
              loading={loading}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'hospitals' && (
            <HospitalAdminsView 
              admins={hospitalAdmins}
              loading={loading}
            />
          )}
          {activeTab === 'doctors' && (
            <DoctorsView 
              doctors={doctors}
              loading={loading}
            />
          )}
          {activeTab === 'patients' && (
            <PatientsView 
              patients={patients}
              loading={loading}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'appointments' && (
            <AppointmentsView 
              appointments={appointments}
              loading={loading}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsView 
              stats={stats}
              appointments={appointments}
            />
          )}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left w-full ${
      active ? 'bg-purple-50 text-purple-600 font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
    }`}
  >
    {icon} <span>{label}</span>
  </button>
);

// Overview View - Dynamic
const OverviewView = ({ stats, appointments, doctors, loading, formatDate }) => (
  <>
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard data...</p>
      </div>
    ) : (
      <>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 animate-stagger">
          <StatCard icon={<FaUserMd className="text-3xl" />} title="Total Doctors" count={stats.totalDoctors} trend={`+${stats.pendingApprovals} pending`} color="blue" />
          <StatCard icon={<FaUsers className="text-3xl" />} title="Total Patients" count={stats.totalPatients} trend="Active users" color="green" />
          <StatCard icon={<FaCalendarAlt className="text-3xl" />} title="Total Appointments" count={stats.totalAppointments} trend={`${stats.todayAppointments} today`} color="purple" />
          <StatCard icon={<FaServer className="text-3xl" />} title="System Status" count="Online" trend="All services running" color="teal" />
        </div>

        {/* System Health & Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-purple-600" /> System Summary
            </h3>
            <div className="space-y-3">
              <HealthMetric label="Registered Doctors" value={stats.totalDoctors.toString()} status="good" />
              <HealthMetric label="Registered Patients" value={stats.totalPatients.toString()} status="good" />
              <HealthMetric label="Total Appointments" value={stats.totalAppointments.toString()} status="good" />
              <HealthMetric label="Today's Appointments" value={stats.todayAppointments.toString()} status={stats.todayAppointments > 0 ? "good" : "warning"} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaBell className="text-purple-600" /> Recent Appointments
            </h3>
            {appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <ActivityItem 
                    key={apt._id}
                    action={apt.patientName}
                    entity={apt.doctorId?.fullName ? `Dr. ${apt.doctorId.fullName}` : 'Doctor'}
                    time={formatDate(apt.appointmentDate)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent appointments</p>
            )}
          </div>
        </div>

        {/* Doctors Overview */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Doctors Overview</h3>
          {doctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.slice(0, 6).map((doc) => (
                <DoctorCard 
                  key={doc._id}
                  name={`Dr. ${doc.fullName}`}
                  specialty={doc.specialization || 'General'}
                  hospital={doc.hospitalName || 'N/A'}
                  status={doc.isApproved !== false ? 'Active' : 'Pending'}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No doctors registered yet</p>
          )}
        </div>
      </>
    )}
  </>
);

// Hospital Admins View - Dynamic
const HospitalAdminsView = ({ admins, loading }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Hospital Administrators</h2>
      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
        <FaPlus /> Add Admin
      </button>
    </div>
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    ) : admins.length > 0 ? (
      <div className="space-y-3">
        {admins.map((admin) => (
          <AdminRow 
            key={admin._id}
            name={admin.fullName}
            hospital={admin.hospitalName || 'N/A'}
            role="Hospital Admin"
            status={admin.isApproved !== false ? 'Active' : 'Pending'}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <FaUserShield className="text-gray-300 text-5xl mx-auto mb-4" />
        <p className="text-gray-500">No hospital administrators registered yet</p>
      </div>
    )}
  </div>
);

// Doctors View - Dynamic
const DoctorsView = ({ doctors, loading }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Doctors Management</h2>
      <div className="flex gap-2">
        <input type="text" placeholder="Search doctors..." className="border rounded-lg px-4 py-2" />
      </div>
    </div>
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    ) : doctors.length > 0 ? (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <DoctorCard 
            key={doc._id}
            name={`Dr. ${doc.fullName}`}
            specialty={doc.specialization || 'General'}
            hospital={doc.hospitalName || 'N/A'}
            status={doc.isApproved !== false ? 'Active' : 'Pending'}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <FaUserMd className="text-gray-300 text-5xl mx-auto mb-4" />
        <p className="text-gray-500">No doctors registered yet</p>
      </div>
    )}
  </div>
);

// Patients View - Dynamic
const PatientsView = ({ patients, loading, formatDate }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Patient Records</h2>
      <input type="text" placeholder="Search patients..." className="border rounded-lg px-4 py-2" />
    </div>
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    ) : patients.length > 0 ? (
      <div className="space-y-3">
        {patients.map((patient) => (
          <PatientRow 
            key={patient._id}
            name={patient.fullName}
            age={patient.age || 'N/A'}
            lastVisit={patient.updatedAt ? formatDate(patient.updatedAt) : 'N/A'}
            email={patient.email || 'N/A'}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <FaUsers className="text-gray-300 text-5xl mx-auto mb-4" />
        <p className="text-gray-500">No patients registered yet</p>
      </div>
    )}
  </div>
);

// Appointments View - Dynamic
const AppointmentsView = ({ appointments, loading, formatDate }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">All Appointments</h2>
      <input type="text" placeholder="Search appointments..." className="border rounded-lg px-4 py-2" />
    </div>
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    ) : appointments.length > 0 ? (
      <div className="space-y-3">
        {appointments.map((apt) => (
          <AppointmentRow 
            key={apt._id}
            patient={apt.patientName}
            doctor={apt.doctorId?.fullName ? `Dr. ${apt.doctorId.fullName}` : 'Doctor'}
            date={formatDate(apt.appointmentDate)}
            time={apt.appointmentTime}
            status={apt.status}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <FaCalendarAlt className="text-gray-300 text-5xl mx-auto mb-4" />
        <p className="text-gray-500">No appointments yet</p>
      </div>
    )}
  </div>
);

// Analytics View - Dynamic
const AnalyticsView = ({ stats, appointments }) => {
  const completedApts = appointments.filter(apt => apt.status === 'Completed').length;
  const pendingApts = appointments.filter(apt => apt.status === 'Pending').length;
  const cancelledApts = appointments.filter(apt => apt.status === 'Cancelled').length;
  
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <AnalyticCard title="Total Appointments" value={stats.totalAppointments.toString()} change={`${stats.todayAppointments} today`} color="blue" />
        <AnalyticCard title="Total Doctors" value={stats.totalDoctors.toString()} change={`${stats.pendingApprovals} pending`} color="green" />
        <AnalyticCard title="Total Patients" value={stats.totalPatients.toString()} change="Active users" color="purple" />
        <AnalyticCard title="Completion Rate" value={`${appointments.length > 0 ? Math.round((completedApts / appointments.length) * 100) : 0}%`} change={`${completedApts} completed`} color="orange" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Appointment Statistics</h3>
          <div className="space-y-3">
            <GrowthMetric label="Completed Appointments" value={completedApts.toString()} period="Total" />
            <GrowthMetric label="Pending Appointments" value={pendingApts.toString()} period="Awaiting" />
            <GrowthMetric label="Cancelled Appointments" value={cancelledApts.toString()} period="Total" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">System Growth</h3>
          <div className="space-y-3">
            <GrowthMetric label="Total Doctors" value={stats.totalDoctors.toString()} period="Registered" />
            <GrowthMetric label="Total Patients" value={stats.totalPatients.toString()} period="Registered" />
            <GrowthMetric label="Total Appointments" value={stats.totalAppointments.toString()} period="Created" />
          </div>
        </div>
      </div>
    </>
  );
};

// Settings View
const SettingsView = () => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-2xl font-bold mb-6">System Settings</h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">General Settings</h3>
        <div className="space-y-2">
          <SettingItem label="Platform Name" value="Smart HealthConnect" />
          <SettingItem label="System Version" value="2.1.0" />
          <SettingItem label="Last Update" value={new Date().toLocaleDateString()} />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Security Settings</h3>
        <div className="space-y-2">
          <SettingItem label="Two-Factor Authentication" value="Enabled" />
          <SettingItem label="Session Timeout" value="30 minutes" />
          <SettingItem label="Password Policy" value="Strong" />
        </div>
      </div>
      <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Save Changes</button>
    </div>
  </div>
);

// Component Definitions
const StatCard = ({ icon, title, count, trend, color }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    teal: 'text-teal-600 bg-teal-50',
    orange: 'text-orange-600 bg-orange-50'
  };
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
      <div className={`${colors[color] || 'text-gray-600 bg-gray-50'} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">{count}</p>
        <span className="text-green-600 text-sm font-medium">{trend}</span>
      </div>
    </div>
  );
};

const HealthMetric = ({ label, value, status }) => {
  const statusColors = {
    good: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    critical: 'bg-red-100 text-red-700'
  };
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <span className="text-gray-700 font-medium">{label}</span>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>{value}</span>
    </div>
  );
};

const ActivityItem = ({ action, entity, time }) => (
  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div>
      <p className="font-medium text-gray-800">{action}</p>
      <p className="text-sm text-gray-600">{entity}</p>
    </div>
    <span className="text-xs text-gray-500">{time}</span>
  </div>
);

const DoctorCard = ({ name, specialty, hospital, status }) => {
  const statusColors = {
    'Active': 'bg-green-100 text-green-700',
    'Pending': 'bg-yellow-100 text-yellow-700'
  };
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-600">{specialty}</p>
          <p className="text-xs text-gray-500 mt-1">{hospital}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
      </div>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 text-sm text-purple-600 hover:text-purple-700 font-medium">View</button>
        <button className="flex-1 text-sm text-blue-600 hover:text-blue-700 font-medium">Edit</button>
      </div>
    </div>
  );
};

const AdminRow = ({ name, hospital, role, status }) => {
  const statusColors = {
    'Active': 'bg-green-100 text-green-700',
    'Pending': 'bg-yellow-100 text-yellow-700'
  };
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-600">{role} • {hospital}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
          <button className="text-blue-600 hover:text-blue-700"><FaEdit /></button>
          <button className="text-red-600 hover:text-red-700"><FaTrash /></button>
        </div>
      </div>
    </div>
  );
};

const PatientRow = ({ name, age, lastVisit, email }) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center">
      <div>
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-sm text-gray-600">Age: {age} • Last visit: {lastVisit}</p>
        <p className="text-xs text-gray-500">{email}</p>
      </div>
      <button className="text-purple-600 hover:text-purple-700"><FaEye /></button>
    </div>
  </div>
);

const AppointmentRow = ({ patient, doctor, date, time, status }) => {
  const statusColors = {
    'Confirmed': 'bg-green-100 text-green-700',
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Completed': 'bg-blue-100 text-blue-700',
    'Cancelled': 'bg-red-100 text-red-700'
  };
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800">{patient}</p>
          <p className="text-sm text-gray-600">{doctor} • {date} at {time}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
          <button className="text-purple-600 hover:text-purple-700"><FaEye /></button>
        </div>
      </div>
    </div>
  );
};

const AnalyticCard = ({ title, value, change, color }) => {
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  };
  return (
    <div className={`${colors[color] || 'bg-gray-50 border-gray-200'} border rounded-lg p-6`}>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <span className="text-gray-500 text-sm">{change}</span>
    </div>
  );
};

const GrowthMetric = ({ label, value, period }) => (
  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
    <div>
      <p className="font-medium text-gray-800">{label}</p>
      <p className="text-xs text-gray-500">{period}</p>
    </div>
    <span className="text-purple-600 font-bold text-lg">{value}</span>
  </div>
);

const SettingItem = ({ label, value }) => (
  <div className="flex justify-between items-center p-3 border-b">
    <span className="text-gray-700 font-medium">{label}</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

export default SystemAdminDashboard;
