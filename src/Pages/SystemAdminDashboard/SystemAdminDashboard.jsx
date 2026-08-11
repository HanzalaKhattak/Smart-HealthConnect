import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaServer, FaUserShield, FaClinicMedical, FaUserMd, FaTools, FaChartPie,
  FaUsers, FaHospital, FaSignOutAlt, FaExclamationTriangle, FaCheck,
  FaCog, FaClipboardList, FaChartLine, FaBell, FaEdit, FaTrash, FaPlus,
  FaEye, FaDatabase, FaShieldAlt, FaCalendarAlt, FaBars
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_Doctor, API_User, API_Appointment, API_HospitalAdmin } from '../../Components/apis/apisUrl';
import {
  Get_All_Doctors, Get_All_Users, Get_All_Appointments,
  Get_All_HospitalAdmins, Get_Pending_HospitalAdmins,
  Approve_HospitalAdmin, Reject_HospitalAdmin,
  Approve_Doctor, Reject_Doctor,
} from '../../Components/apis/endpoints';

const SystemAdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data states
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [hospitalAdmins, setHospitalAdmins] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
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
      // Fetch ALL doctors (including pending) — requires admin token
      try {
        const doctorsRes = await axios.get(`${API_Doctor}${Get_All_Doctors}?all=true`, { headers });
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
        const appointmentsRes = await axios.get(`${API_Appointment}${Get_All_Appointments}`, { headers });
        appointmentsList = appointmentsRes.data.appointments || appointmentsRes.data || [];
        setAppointments(appointmentsList);
      } catch (err) {
        console.log('Error fetching appointments:', err);
      }
      
      // Try to fetch hospital admins
      try {
        const adminsRes = await axios.get(`${API_HospitalAdmin}${Get_All_HospitalAdmins}`, { headers });
        adminsList = adminsRes.data || [];
        setHospitalAdmins(adminsList);
      } catch {
        console.log('Hospital admins endpoint not available');
      }

      // Pending hospital admins awaiting super-admin approval
      try {
        const pendRes = await axios.get(`${API_HospitalAdmin}${Get_Pending_HospitalAdmins}`, { headers });
        setPendingAdmins(Array.isArray(pendRes.data) ? pendRes.data : []);
      } catch {
        setPendingAdmins([]);
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

  const handleApproveHospitalAdmin = async (adminId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_HospitalAdmin}${Approve_HospitalAdmin}/${adminId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to approve hospital admin');
    }
  };

  const handleRejectHospitalAdmin = async (adminId) => {
    const reason = window.prompt('Reason for rejection (optional):', '');
    if (reason === null) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_HospitalAdmin}${Reject_HospitalAdmin}/${adminId}`, { reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to reject hospital admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-fade-in">
      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-x-0 top-16 bottom-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed md:sticky top-16 left-0 z-40 w-64 bg-white shadow-lg h-[calc(100vh-4rem)] overflow-y-auto p-6 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
            />
            <NavItem 
              icon={<FaHospital />} 
              label="Hospital Admins" 
              active={activeTab === 'hospitals'}
              onClick={() => { setActiveTab('hospitals'); setSidebarOpen(false); }}
            />
            <NavItem 
              icon={<FaUserMd />} 
              label="Doctors" 
              active={activeTab === 'doctors'}
              onClick={() => { setActiveTab('doctors'); setSidebarOpen(false); }}
            />
            <NavItem 
              icon={<FaExclamationTriangle />} 
              label={`Pending Approvals${(stats.pendingApprovals + pendingAdmins.length) > 0 ? ` (${stats.pendingApprovals + pendingAdmins.length})` : ''}`}
              active={activeTab === 'pending'}
              onClick={() => { setActiveTab('pending'); setSidebarOpen(false); }}
            />
            <NavItem 
              icon={<FaUsers />} 
              label="Patients" 
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
              icon={<FaChartLine />} 
              label="Analytics" 
              active={activeTab === 'analytics'}
              onClick={() => { setActiveTab('analytics'); setSidebarOpen(false); }}
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
              <FaBars className="text-purple-600 text-xl" />
            </button>
            <h2 className="text-lg font-bold text-gray-800">System Admin</h2>
          </div>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">System Administration</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Monitor and manage the entire Smart HealthConnect platform</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('pending')}
                  className="relative p-3 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors"
                >
                  <FaBell className="text-purple-600 text-xl" />
                  {(stats.pendingApprovals + pendingAdmins.length) > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {stats.pendingApprovals + pendingAdmins.length}
                    </span>
                  )}
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
              onNavigate={setActiveTab}
            />
          )}
          {activeTab === 'hospitals' && (
            <HospitalAdminsView 
              admins={hospitalAdmins}
              pendingAdmins={pendingAdmins}
              loading={loading}
              onApprove={handleApproveHospitalAdmin}
              onReject={handleRejectHospitalAdmin}
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
          {activeTab === 'pending' && (
            <PendingApprovalsView
              doctors={doctors.filter(d => d.isApproved === false)}
              pendingAdmins={pendingAdmins}
              loading={loading}
              onApprove={handleApproveDoctor}
              onReject={handleRejectDoctor}
              onApproveAdmin={handleApproveHospitalAdmin}
              onRejectAdmin={handleRejectHospitalAdmin}
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
const OverviewView = ({ stats, appointments, doctors, loading, formatDate, onNavigate }) => (
  <>
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard data...</p>
      </div>
    ) : (
      <>
        {/* Pending approvals alert banner */}
        {stats.pendingApprovals > 0 && (
          <button
            onClick={() => onNavigate('pending')}
            className="w-full mb-6 bg-yellow-50 border border-yellow-300 rounded-xl p-4 flex items-center gap-3 hover:bg-yellow-100 transition text-left"
          >
            <FaExclamationTriangle className="text-yellow-500 text-2xl flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-800">
                {stats.pendingApprovals} doctor{stats.pendingApprovals > 1 ? 's' : ''} waiting for approval
              </p>
              <p className="text-sm text-yellow-700">Click to review and approve</p>
            </div>
            <span className="text-yellow-600 text-sm font-medium">Review →</span>
          </button>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 animate-stagger">
          <StatCard icon={<FaUserMd className="text-3xl" />} title="Total Doctors" count={stats.totalDoctors} trend={`+${stats.pendingApprovals} pending`} color="blue" />
          <StatCard icon={<FaUsers className="text-3xl" />} title="Total Patients" count={stats.totalPatients} trend="Active users" color="green" />
          <StatCard icon={<FaCalendarAlt className="text-3xl" />} title="Total Appointments" count={stats.totalAppointments} trend={`${stats.todayAppointments} today`} color="purple" />
          <button onClick={() => onNavigate('pending')} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-left w-full">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 text-yellow-600 bg-yellow-50">
              <FaExclamationTriangle className="text-3xl" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Pending Approvals</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
              <span className={`text-sm font-medium ${stats.pendingApprovals > 0 ? 'text-red-500' : 'text-green-600'}`}>
                {stats.pendingApprovals > 0 ? 'Action needed' : 'All clear'}
              </span>
            </div>
          </button>
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
const HospitalAdminsView = ({ admins, pendingAdmins = [], loading, onApprove, onReject }) => (
  <div className="space-y-6">
    {pendingAdmins.length > 0 && (
      <div className="bg-white p-6 rounded-xl shadow-md border-2 border-yellow-300">
        <div className="flex items-center gap-2 mb-4">
          <FaExclamationTriangle className="text-yellow-500" />
          <h2 className="text-xl font-bold">Pending Hospital Admins ({pendingAdmins.length})</h2>
        </div>
        <div className="space-y-3">
          {pendingAdmins.map((admin) => (
            <div key={admin._id} className="border rounded-lg p-4 flex justify-between items-center gap-3 flex-wrap">
              <div className="min-w-0">
                <p className="font-semibold">{admin.fullName || admin.username}</p>
                <p className="text-sm text-gray-600">Hospital: {admin.hospitalName || admin.hospitalId?.name || 'N/A'}</p>
                <p className="text-xs text-gray-500 truncate">{admin.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onApprove && onApprove(admin._id)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1">
                  <FaCheck /> Approve
                </button>
                <button onClick={() => onReject && onReject(admin._id)} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Approved Hospital Administrators</h2>
      </div>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      ) : admins.filter(a => a.isApproved).length > 0 ? (
        <div className="space-y-3">
          {admins.filter(a => a.isApproved).map((admin) => (
            <AdminRow
              key={admin._id}
              name={admin.fullName}
              hospital={admin.hospitalName || admin.hospitalId?.name || 'N/A'}
              role="Hospital Admin"
              status="Active"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaUserShield className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-500">No approved hospital administrators yet</p>
        </div>
      )}
    </div>
  </div>
);

// Pending Approvals View
const PendingApprovalsView = ({ doctors, pendingAdmins = [], loading, onApprove, onReject, onApproveAdmin, onRejectAdmin }) => (
  <div className="space-y-4">
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
      <FaExclamationTriangle className="text-yellow-500 text-xl mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-semibold text-yellow-800">Approvals Required</p>
        <p className="text-sm text-yellow-700 mt-0.5">
          Doctors and hospital administrators cannot use the platform until you approve them below.
        </p>
      </div>
    </div>

    {pendingAdmins.length > 0 && (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaUserShield className="text-purple-500" /> Pending Hospital Admins
          <span className="ml-2 bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-0.5 rounded-full">
            {pendingAdmins.length}
          </span>
        </h2>
        <div className="space-y-3">
          {pendingAdmins.map((admin) => (
            <div key={admin._id} className="border rounded-lg p-4 flex justify-between items-center gap-3 flex-wrap">
              <div className="min-w-0">
                <p className="font-semibold">{admin.fullName || admin.username}</p>
                <p className="text-sm text-gray-600">Hospital: {admin.hospitalName || admin.hospitalId?.name || 'N/A'}</p>
                <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                {admin.phone && <p className="text-xs text-gray-500">Phone: {admin.phone}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onApproveAdmin && onApproveAdmin(admin._id)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1">
                  <FaCheck /> Approve
                </button>
                <button onClick={() => onRejectAdmin && onRejectAdmin(admin._id)} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaExclamationTriangle className="text-yellow-500" /> Pending Doctor Approvals
        {doctors.length > 0 && (
          <span className="ml-2 bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-0.5 rounded-full">
            {doctors.length}
          </span>
        )}
      </h2>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-12">
          <FaCheck className="text-green-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 font-medium">All caught up!</p>
          <p className="text-gray-400 text-sm mt-1">No doctors are waiting for approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doc) => (
            <div key={doc._id} className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {doc.avatar ? (
                    <img src={doc.avatar} alt="" className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-2xl flex-shrink-0">
                      <FaUserMd />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-800 text-base">Dr. {doc.fullName || doc.username}</p>
                    <p className="text-sm text-purple-700 font-medium">{doc.specialization}</p>
                    <div className="mt-1 space-y-0.5 text-xs text-gray-500">
                      {doc.email && <p>✉️ {doc.email}</p>}
                      {doc.phone && <p>📞 {doc.phone}</p>}
                      {doc.licenseNumber && <p>🪪 License: {doc.licenseNumber}</p>}
                      {doc.experience && <p>🏥 Experience: {doc.experience}</p>}
                      {doc.qualifications?.length > 0 && (
                        <p>🎓 {doc.qualifications.join(', ')}</p>
                      )}
                      {doc.hospitalId?.name && <p>🏨 {doc.hospitalId.name}</p>}
                      {doc.consultationFee > 0 && <p>💰 Fee: Rs. {doc.consultationFee}</p>}
                    </div>
                    {doc.bio && (
                      <p className="mt-2 text-xs text-gray-600 italic line-clamp-2">{doc.bio}</p>
                    )}
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 sm:w-32 flex-shrink-0">
                  <button
                    onClick={() => onApprove(doc._id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition"
                  >
                    <FaCheck /> Approve
                  </button>
                  <button
                    onClick={() => onReject(doc._id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// Doctors View - Dynamic
const DoctorsView = ({ doctors, loading, onApprove, onReject }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Doctors Management</h2>
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

const DoctorCard = ({ doctor, name, specialty, hospital, status, onApprove, onReject }) => {
  // Support both signatures: object `doctor` or flat props (for overview cards)
  const isPending = doctor ? doctor.isApproved === false : status === 'Pending';
  const displayName = doctor ? `Dr. ${doctor.fullName || doctor.username || ''}` : name;
  const displaySpecialty = doctor ? (doctor.specialization || 'General') : specialty;
  const displayHospital = doctor ? (doctor.hospitalName || doctor.hospitalId?.name || 'N/A') : hospital;
  const statusColors = {
    'Active': 'bg-green-100 text-green-700',
    'Pending': 'bg-yellow-100 text-yellow-700'
  };
  const statusLabel = isPending ? 'Pending' : 'Active';
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-800">{displayName}</p>
          <p className="text-sm text-gray-600">{displaySpecialty}</p>
          <p className="text-xs text-gray-500 mt-1">{displayHospital}</p>
          {doctor?.email && <p className="text-xs text-gray-400 mt-1">{doctor.email}</p>}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[statusLabel] || 'bg-gray-100 text-gray-700'}`}>{statusLabel}</span>
      </div>
      {doctor && isPending && onApprove && onReject && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => onApprove(doctor._id)} className="flex-1 text-sm bg-green-600 text-white py-1 rounded hover:bg-green-700">Approve</button>
          <button onClick={() => onReject(doctor._id)} className="flex-1 text-sm bg-red-600 text-white py-1 rounded hover:bg-red-700">Reject</button>
        </div>
      )}
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
