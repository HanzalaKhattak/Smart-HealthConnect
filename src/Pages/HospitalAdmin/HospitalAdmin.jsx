import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaHospital, FaUserMd, FaUsers, FaCalendarAlt, FaFileMedical, FaCog, 
  FaChartLine, FaBell, FaSignOutAlt, FaCheckCircle, FaTimes, FaEye,
  FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaClock, FaMoneyBillWave, FaBars
} from 'react-icons/fa';
import { API_Doctor, API_User, API_Appointment } from '../../Components/apis/apisUrl';
import { Get_All_Doctors, Get_All_Users, Get_All_Appointments, Approve_Doctor, Reject_Doctor } from '../../Components/apis/endpoints';

const HospitalAdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');
  const [hospitalName, setHospitalName] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data states
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    todayAppointments: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    const username = localStorage.getItem('username');
    const hospital = localStorage.getItem('hospitalName') || 'Your Hospital';
    setAdminName(username || 'Admin');
    setHospitalName(hospital);
    
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    let doctorsList = [];
    let usersList = [];
    let appointmentsList = [];
    
    try {
      // Fetch all doctors (include pending for admin approval queue)
      try {
        const doctorsRes = await axios.get(`${API_Doctor}${Get_All_Doctors}?all=true&pending=true`, { headers });
        doctorsList = doctorsRes.data.Doctors || doctorsRes.data.doctors || doctorsRes.data || [];
        setDoctors(doctorsList);
      } catch (err) {
        console.log('Error fetching doctors:', err);
        setDoctors([]);
      }
      
      // Fetch all users (patients)
      try {
        const usersRes = await axios.get(`${API_User}${Get_All_Users}`, { headers });
        usersList = usersRes.data || [];
        setPatients(usersList);
      } catch (err) {
        console.log('Error fetching patients:', err);
        setPatients([]);
      }
      
      // Fetch all appointments
      try {
        const appointmentsRes = await axios.get(`${API_Appointment}${Get_All_Appointments}`);
        appointmentsList = appointmentsRes.data.appointments || appointmentsRes.data || [];
        setAppointments(appointmentsList);
      } catch (err) {
        console.log('Error fetching appointments:', err);
        setAppointments([]);
      }
      
      // Calculate stats using local variables
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayApts = appointmentsList.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= today && aptDate < tomorrow;
      });
      
      // Calculate pending approvals (doctors with pending status)
      const pendingDoctors = doctorsList.filter(doc => doc.status === 'pending' || !doc.isApproved);
      
      setStats({
        totalDoctors: doctorsList.length,
        totalPatients: usersList.length,
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

  const handleApproveDoctor = async (doctorId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_Doctor}${Approve_Doctor}/${doctorId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to approve doctor');
    }
  };

  const handleRejectDoctor = async (doctorId) => {
    const reason = window.prompt('Reason for rejection (optional):', '');
    if (reason === null) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_Doctor}${Reject_Doctor}/${doctorId}`, { reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to reject doctor');
    }
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
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed md:sticky top-0 left-0 z-50 w-64 bg-white shadow-lg min-h-screen h-screen overflow-y-auto p-6 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FaHospital className="text-green-600 text-3xl" />
              <div>
                <h2 className="font-bold text-gray-800 text-lg">{hospitalName}</h2>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <NavItem 
              icon={<FaChartLine />} 
              label="Dashboard" 
              active={activeTab === 'dashboard'}
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            />
            <NavItem 
              icon={<FaUserMd />} 
              label="Manage Doctors" 
              active={activeTab === 'doctors'}
              onClick={() => { setActiveTab('doctors'); setSidebarOpen(false); }}
            />
            <NavItem 
              icon={<FaUsers />} 
              label="Manage Patients" 
              active={activeTab === 'patients'}
              onClick={() => { setActiveTab('patients'); setSidebarOpen(false); }}
            />
            <NavItem 
              icon={<FaCalendarAlt />} 
              label="Appointments" 
              active={activeTab === 'appointments'}
              onClick={() => { setActiveTab('appointments'); setSidebarOpen(false); }}
            />
            <NavItem 
              icon={<FaFileMedical />} 
              label="Reports & Analytics" 
              active={activeTab === 'reports'}
              onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
            />
            <NavItem 
              icon={<FaCog />} 
              label="Settings" 
              active={activeTab === 'settings'}
              onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
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
        <main className="flex-1 p-3 sm:p-6 min-w-0">
          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-3 mb-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white rounded-lg shadow">
              <FaBars className="text-green-600 text-xl" />
            </button>
            <h2 className="text-lg font-bold text-gray-800">Hospital Admin</h2>
          </div>

          {/* Welcome */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">Welcome, {adminName}</h2>
            <p className="text-gray-600 text-sm sm:text-base">Here's an overview of the hospital's performance and activity.</p>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'dashboard' && (
            <DashboardView 
              stats={stats} 
              appointments={getRecentAppointments()}
              doctors={doctors}
              loading={loading}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'doctors' && (
            <DoctorsView 
              doctors={doctors} 
              loading={loading}
              onApprove={handleApproveDoctor}
              onReject={handleRejectDoctor}
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
          {activeTab === 'reports' && (
            <ReportsView 
              stats={stats}
              appointments={appointments}
            />
          )}
          {activeTab === 'settings' && <SettingsView hospitalName={hospitalName} />}
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
      active ? 'bg-green-50 text-green-600 font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
    }`}
  >
    {icon} <span>{label}</span>
  </button>
);

// Dashboard View - Dynamic
const DashboardView = ({ stats, appointments, doctors, loading, formatDate }) => (
  <>
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard data...</p>
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 animate-stagger">
          <StatCard icon={<FaUserMd className="text-3xl" />} title="Total Doctors" count={stats.totalDoctors} color="blue" />
          <StatCard icon={<FaUsers className="text-3xl" />} title="Total Patients" count={stats.totalPatients} color="green" />
          <StatCard icon={<FaCalendarAlt className="text-3xl" />} title="Today's Appointments" count={stats.todayAppointments} color="purple" />
          <StatCard icon={<FaClock className="text-3xl" />} title="Pending Approvals" count={stats.pendingApprovals} color="yellow" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaChartLine className="text-green-600" /> Recent Appointments
            </h3>
            {appointments.length > 0 ? (
              <ul className="space-y-3">
                {appointments.map((apt) => (
                  <ActivityLog 
                    key={apt._id}
                    item={`${apt.patientName} - ${apt.doctorId?.fullName || 'Doctor'}`} 
                    time={formatDate(apt.appointmentDate)} 
                    type={apt.status === 'Confirmed' ? 'success' : apt.status === 'Pending' ? 'warning' : 'info'} 
                  />
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent appointments</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <QuickActionBtn icon={<FaPlus />} label="Add Doctor" />
              <QuickActionBtn icon={<FaPlus />} label="Add Patient" />
              <QuickActionBtn icon={<FaCalendarAlt />} label="Schedule" />
              <QuickActionBtn icon={<FaFileMedical />} label="Report" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Doctors Overview</h3>
          {doctors.length > 0 ? (
            <div className="space-y-3">
              {doctors.slice(0, 3).map((doc) => (
                <DoctorApprovalCard 
                  key={doc._id}
                  name={`Dr. ${doc.fullName}`} 
                  specialty={doc.specialization || 'General'} 
                  license={doc.licenseNumber || 'N/A'} 
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

// Doctors View - Dynamic
const DoctorsView = ({ doctors, loading, onApprove, onReject }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Manage Doctors</h2>
    </div>
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
      </div>
    ) : doctors.length > 0 ? (
      <div className="space-y-4">
        {doctors.map((doc) => (
          <DoctorCard 
            key={doc._id}
            doctor={doc}
            onApprove={onApprove}
            onReject={onReject}
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
      <h2 className="text-2xl font-bold">Manage Patients</h2>
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
        <FaPlus /> Register Patient
      </button>
    </div>
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
      </div>
    ) : patients.length > 0 ? (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <PatientCard 
            key={patient._id}
            name={patient.fullName} 
            age={patient.age || 'N/A'} 
            lastVisit={patient.updatedAt ? formatDate(patient.updatedAt) : 'N/A'} 
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
    <h2 className="text-2xl font-bold mb-6">All Appointments</h2>
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
      </div>
    ) : appointments.length > 0 ? (
      <div className="space-y-3">
        {appointments.map((apt) => (
          <AppointmentCard 
            key={apt._id}
            patient={apt.patientName} 
            doctor={apt.doctorId?.fullName ? `Dr. ${apt.doctorId.fullName}` : 'Doctor'} 
            time={`${formatDate(apt.appointmentDate)} at ${apt.appointmentTime}`} 
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

// Reports View - Dynamic
const ReportsView = ({ stats, appointments }) => {
  // Calculate stats from appointments
  const completedApts = appointments.filter(apt => apt.status === 'Completed').length;
  const cancelledApts = appointments.filter(apt => apt.status === 'Cancelled').length;
  const completionRate = appointments.length > 0 
    ? Math.round((completedApts / appointments.length) * 100) 
    : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <ReportCard title="Total Appointments" value={appointments.length.toString()} change={`${stats.todayAppointments} today`} />
        <ReportCard title="Completion Rate" value={`${completionRate}%`} change={`${completedApts} completed`} />
        <ReportCard title="Cancellation Rate" value={`${appointments.length > 0 ? Math.round((cancelledApts / appointments.length) * 100) : 0}%`} change={`${cancelledApts} cancelled`} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Doctors Summary</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalDoctors}</p>
          <p className="text-sm text-gray-500">Registered doctors</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Patients Summary</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalPatients}</p>
          <p className="text-sm text-gray-500">Registered patients</p>
        </div>
      </div>
    </div>
  );
};

// Settings View - Dynamic
const SettingsView = ({ hospitalName }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-2xl font-bold mb-6">Hospital Settings</h2>
    <div className="space-y-4">
      <SettingItem label="Hospital Name" value={hospitalName || 'Not Set'} />
      <SettingItem label="Address" value="Update in profile" />
      <SettingItem label="Contact" value="Update in profile" />
    </div>
    <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
      Update Settings
    </button>
  </div>
);

// Component Definitions
const StatCard = ({ icon, title, count, color }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    indigo: 'text-indigo-600 bg-indigo-50'
  };
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
      <div className={`${colors[color] || 'text-gray-600 bg-gray-50'} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
};

const ActivityLog = ({ item, time, type }) => {
  const colors = {
    success: 'border-green-200 bg-green-50',
    info: 'border-blue-200 bg-blue-50',
    warning: 'border-yellow-200 bg-yellow-50'
  };
  return (
    <li className={`border-l-4 ${colors[type] || 'border-gray-200 bg-gray-50'} p-3 rounded`}>
      <p className="font-medium text-gray-800">{item}</p>
      <p className="text-sm text-gray-500">{time}</p>
    </li>
  );
};

const QuickActionBtn = ({ icon, label }) => (
  <button className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
    <div className="text-2xl text-gray-600 group-hover:text-green-600 mb-2">{icon}</div>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const DoctorApprovalCard = ({ name, specialty, license }) => (
  <div className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow">
    <div>
      <p className="font-semibold text-gray-800">{name}</p>
      <p className="text-sm text-gray-600">{specialty} • {license}</p>
    </div>
    <div className="flex gap-2">
      <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><FaCheckCircle /></button>
      <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><FaTimes /></button>
      <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"><FaEye /></button>
    </div>
  </div>
);

const DoctorCard = ({ doctor, onApprove, onReject }) => {
  const isPending = doctor.isApproved === false;
  const name = `Dr. ${doctor.fullName || doctor.username || ''}`;
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center gap-3 flex-wrap">
      <div className="min-w-0">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-600">{doctor.specialization || 'General'} • License: {doctor.licenseNumber || 'N/A'}</p>
        <p className="text-xs text-gray-500">{doctor.email}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-xs ${isPending ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
          {isPending ? 'Pending approval' : 'Active'}
        </span>
        {isPending && (
          <>
            <button onClick={() => onApprove && onApprove(doctor._id)} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Approve</button>
            <button onClick={() => onReject && onReject(doctor._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Reject</button>
          </>
        )}
      </div>
    </div>
  );
};

const PatientCard = ({ name, age, lastVisit }) => (
  <div className="border rounded-lg p-4">
    <p className="font-semibold">{name}</p>
    <p className="text-sm text-gray-600">Age: {age}</p>
    <p className="text-xs text-gray-500">Last visit: {lastVisit}</p>
  </div>
);

const AppointmentCard = ({ patient, doctor, time, status }) => {
  const statusColors = {
    'Confirmed': 'bg-green-100 text-green-700',
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Completed': 'bg-blue-100 text-blue-700',
    'Cancelled': 'bg-red-100 text-red-700',
    'In Progress': 'bg-purple-100 text-purple-700'
  };
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">{patient}</p>
        <p className="text-sm text-gray-600">{doctor} • {time}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
    </div>
  );
};

const ReportCard = ({ title, value, change }) => (
  <div className="bg-gray-50 rounded-xl p-6">
    <p className="text-gray-600 mb-2">{title}</p>
    <p className="text-3xl font-bold mb-1">{value}</p>
    <p className="text-sm text-gray-500">{change}</p>
  </div>
);

const SettingItem = ({ label, value }) => (
  <div className="flex justify-between items-center p-3 border-b">
    <span className="text-gray-700 font-medium">{label}</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

export default HospitalAdminDashboard;
