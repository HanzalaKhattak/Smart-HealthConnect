import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaHospital, FaUserMd, FaUsers, FaCalendarAlt, FaFileMedical, FaCog,
  FaChartLine, FaBell, FaSignOutAlt, FaCheckCircle, FaTimes, FaEye,
  FaPlus, FaEdit, FaTrash, FaSearch, FaClock, FaBars, FaEnvelope,
  FaPhone, FaMapMarkerAlt, FaIdBadge, FaVenusMars, FaBirthdayCake,
  FaSave, FaRedo
} from 'react-icons/fa';
import {
  API_Doctor, API_User, API_Appointment, API_Hospital, API_Notification
} from '../../Components/apis/apisUrl';
import {
  Get_All_Doctors, Get_All_Users, Get_All_Appointments,
  Delete_Doctor, Register_Doctor,
  Cancel_Appointment, Update_Appointment, Notif_List
} from '../../Components/apis/endpoints';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const HospitalAdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [hospital, setHospital] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // { title, body, onClose }

  const [stats, setStats] = useState({
    totalDoctors: 0, totalPatients: 0, todayAppointments: 0, pendingApprovals: 0,
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAllData = useCallback(async () => {
    setRefreshing(true);
    let doctorsList = [], usersList = [], appointmentsList = [], notifList = [];
    try {
      const [dRes, uRes, aRes, nRes] = await Promise.allSettled([
        axios.get(`${API_Doctor}${Get_All_Doctors}?all=true`, { headers: authHeaders() }),
        axios.get(`${API_User}${Get_All_Users}`, { headers: authHeaders() }),
        axios.get(`${API_Appointment}${Get_All_Appointments}`, { headers: authHeaders() }),
        axios.get(`${API_Notification}${Notif_List}`, { headers: authHeaders() }),
      ]);

      if (dRes.status === 'fulfilled') {
        doctorsList = dRes.value.data.Doctors || dRes.value.data.doctors || dRes.value.data || [];
      }
      if (uRes.status === 'fulfilled') {
        usersList = Array.isArray(uRes.value.data) ? uRes.value.data : (uRes.value.data.users || []);
      }
      if (aRes.status === 'fulfilled') {
        appointmentsList = aRes.value.data.appointments || aRes.value.data || [];
      }
      if (nRes.status === 'fulfilled') {
        notifList = nRes.value.data.notifications || nRes.value.data || [];
      }

      setDoctors(doctorsList);
      setPatients(usersList);
      setAppointments(appointmentsList);
      setNotifications(notifList);

      const today = new Date(); today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
      const todayApts = appointmentsList.filter(a => {
        const d = new Date(a.appointmentDate);
        return d >= today && d < tomorrow;
      });
      const pendingDoctors = doctorsList.filter(d => d.isApproved === false);

      setStats({
        totalDoctors: doctorsList.length,
        totalPatients: usersList.length,
        todayAppointments: todayApts.length,
        pendingApprovals: pendingDoctors.length,
      });
    } catch (err) {
      console.error('fetchAllData error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchHospital = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await axios.get(`${API_Hospital}/${id}`, { headers: authHeaders() });
      setHospital(res.data.hospital || res.data);
    } catch (err) {
      console.log('fetchHospital error:', err);
    }
  }, []);

  useEffect(() => {
    setAdminName(localStorage.getItem('username') || 'Admin');
    setHospitalName(localStorage.getItem('hospitalName') || 'Your Hospital');
    const hid = localStorage.getItem('hospitalId') || '';
    setHospitalId(hid);
    fetchAllData();
    if (hid) fetchHospital(hid);
  }, [fetchAllData, fetchHospital]);

  const formatDate = (v) => v ? new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

  const handleDeleteDoctor = async (doctorId, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_Doctor}${Delete_Doctor}/${doctorId}`, { headers: authHeaders() });
      showToast('Doctor deleted');
      await fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to delete', 'error');
    }
  };

  const handleRegisterDoctor = async (form) => {
    try {
      await axios.post(`${API_Doctor}${Register_Doctor}`, form, { headers: authHeaders() });
      showToast('Doctor registered. Awaiting super-admin approval.');
      await fetchAllData();
      return true;
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to register doctor', 'error');
      return false;
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const reason = window.prompt('Reason for cancellation:', '');
    if (reason === null) return;
    try {
      await axios.put(`${API_Appointment}${Cancel_Appointment}/${appointmentId}`, { cancelReason: reason }, { headers: authHeaders() });
      showToast('Appointment cancelled');
      await fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to cancel', 'error');
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    try {
      await axios.put(`${API_Appointment}${Update_Appointment}/${appointmentId}`, { status }, { headers: authHeaders() });
      showToast(`Appointment marked as ${status}`);
      await fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to update', 'error');
    }
  };

  const handleUpdateHospital = async (patch) => {
    if (!hospitalId) return showToast('No hospital linked to your account', 'error');
    try {
      const res = await axios.put(`${API_Hospital}/${hospitalId}`, patch, { headers: authHeaders() });
      setHospital(res.data.hospital || res.data);
      showToast('Hospital info updated');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to update hospital', 'error');
    }
  };

  const openDetails = (title, node) => setModal({ title, body: node });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt || b.appointmentDate) - new Date(a.createdAt || a.appointmentDate))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {toast && (
        <div className={`fixed top-4 right-4 z-[60] px-4 py-3 rounded-lg shadow-lg text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.message}
        </div>
      )}

      {modal && (
        <Modal title={modal.title} onClose={() => setModal(null)}>{modal.body}</Modal>
      )}

      <div className="flex">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`fixed md:sticky top-0 left-0 z-50 w-64 bg-white shadow-lg min-h-screen h-screen overflow-y-auto p-6 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FaHospital className="text-green-600 text-3xl" />
              <div className="min-w-0">
                <h2 className="font-bold text-gray-800 text-base truncate">{hospitalName}</h2>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <NavItem icon={<FaChartLine />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }} />
            <NavItem icon={<FaUserMd />} label="Manage Doctors" active={activeTab === 'doctors'} onClick={() => { setActiveTab('doctors'); setSidebarOpen(false); }} />
            <NavItem icon={<FaUsers />} label="Manage Patients" active={activeTab === 'patients'} onClick={() => { setActiveTab('patients'); setSidebarOpen(false); }} />
            <NavItem icon={<FaCalendarAlt />} label="Appointments" active={activeTab === 'appointments'} onClick={() => { setActiveTab('appointments'); setSidebarOpen(false); }} />
            <NavItem icon={<FaFileMedical />} label="Reports & Analytics" active={activeTab === 'reports'} onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }} />
            <NavItem icon={<FaCog />} label="Settings" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }} />
            <hr className="my-4" />
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left w-full">
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-3 sm:p-6 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="md:hidden flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white rounded-lg shadow">
                <FaBars className="text-green-600 text-xl" />
              </button>
              <h2 className="text-lg font-bold text-gray-800">Hospital Admin</h2>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button onClick={fetchAllData} disabled={refreshing} className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 disabled:opacity-50" title="Refresh">
                <FaRedo className={`text-gray-700 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <div className="relative">
                <button onClick={() => setNotifOpen(o => !o)} className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 relative" title="Notifications">
                  <FaBell className="text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border z-50">
                    <div className="px-4 py-3 border-b flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Notifications</span>
                      <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-700"><FaTimes /></button>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="p-6 text-center text-gray-500 text-sm">No notifications yet</p>
                    ) : (
                      <ul>
                        {notifications.slice(0, 15).map(n => (
                          <li key={n._id} className={`p-3 border-b text-sm ${!n.read ? 'bg-blue-50' : ''}`}>
                            <p className="font-medium text-gray-800">{n.title}</p>
                            {n.message && <p className="text-gray-600 mt-0.5">{n.message}</p>}
                            <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">Welcome, {adminName}</h2>
            <p className="text-gray-600 text-sm sm:text-base">Overview of {hospitalName || 'your hospital'}.</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading data…</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  appointments={recentAppointments}
                  doctors={doctors}
                  formatDate={formatDate}
                  onGoToTab={setActiveTab}
                  onView={(doc) => openDetails('Doctor Details', <DoctorDetails d={doc} />)}
                />
              )}
              {activeTab === 'doctors' && (
                <DoctorsView
                  doctors={doctors}
                  onDelete={handleDeleteDoctor}
                  onRegister={handleRegisterDoctor}
                  onView={(doc) => openDetails('Doctor Details', <DoctorDetails d={doc} />)}
                />
              )}
              {activeTab === 'patients' && (
                <PatientsView
                  patients={patients}
                  formatDate={formatDate}
                  onView={(p) => openDetails('Patient Details', <PatientDetails p={p} formatDate={formatDate} />)}
                />
              )}
              {activeTab === 'appointments' && (
                <AppointmentsView
                  appointments={appointments}
                  formatDate={formatDate}
                  onCancel={handleCancelAppointment}
                  onStatus={handleUpdateAppointmentStatus}
                  onView={(a) => openDetails('Appointment Details', <AppointmentDetails a={a} formatDate={formatDate} />)}
                />
              )}
              {activeTab === 'reports' && (
                <ReportsView stats={stats} appointments={appointments} doctors={doctors} />
              )}
              {activeTab === 'settings' && (
                <SettingsView
                  hospital={hospital}
                  hospitalName={hospitalName}
                  onSave={handleUpdateHospital}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left w-full ${active ? 'bg-green-50 text-green-600 font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'}`}>
    {icon} <span>{label}</span>
  </button>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1"><FaTimes /></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-2 border-b last:border-b-0">
    <div className="text-green-600 mt-1">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-gray-800 font-medium break-words">{value || 'N/A'}</p>
    </div>
  </div>
);

const DoctorDetails = ({ d }) => (
  <div>
    <DetailRow icon={<FaUserMd />} label="Full Name" value={d.fullName || d.username} />
    <DetailRow icon={<FaEnvelope />} label="Email" value={d.email} />
    <DetailRow icon={<FaPhone />} label="Phone" value={d.phone} />
    <DetailRow icon={<FaIdBadge />} label="Specialization" value={d.specialization} />
    <DetailRow icon={<FaIdBadge />} label="License Number" value={d.licenseNumber} />
    <DetailRow icon={<FaVenusMars />} label="Gender" value={d.gender} />
    <DetailRow icon={<FaHospital />} label="Hospital" value={d.hospitalId?.name || d.hospitalName || 'Not assigned'} />
    <DetailRow icon={<FaCheckCircle />} label="Approved" value={d.isApproved ? 'Yes' : 'Pending'} />
    <DetailRow icon={<FaClock />} label="Experience" value={d.experience} />
  </div>
);

const PatientDetails = ({ p, formatDate }) => (
  <div>
    <DetailRow icon={<FaUsers />} label="Full Name" value={p.fullName || p.username} />
    <DetailRow icon={<FaEnvelope />} label="Email" value={p.email} />
    <DetailRow icon={<FaPhone />} label="Phone" value={p.phone} />
    <DetailRow icon={<FaBirthdayCake />} label="Date of Birth" value={p.dateOfBirth ? formatDate(p.dateOfBirth) : 'N/A'} />
    <DetailRow icon={<FaVenusMars />} label="Gender" value={p.gender} />
    <DetailRow icon={<FaMapMarkerAlt />} label="City" value={p.address?.city} />
    <DetailRow icon={<FaFileMedical />} label="Blood Group" value={p.bloodGroup} />
    <DetailRow icon={<FaFileMedical />} label="Allergies" value={p.allergies} />
  </div>
);

const AppointmentDetails = ({ a, formatDate }) => (
  <div>
    <DetailRow icon={<FaUsers />} label="Patient" value={a.patientName} />
    <DetailRow icon={<FaUserMd />} label="Doctor" value={a.doctorId?.fullName || a.doctorId?.username} />
    <DetailRow icon={<FaCalendarAlt />} label="Date" value={formatDate(a.appointmentDate)} />
    <DetailRow icon={<FaClock />} label="Time" value={a.appointmentTime} />
    <DetailRow icon={<FaFileMedical />} label="Symptoms" value={a.symptoms} />
    <DetailRow icon={<FaFileMedical />} label="Notes" value={a.notes} />
    <DetailRow icon={<FaCheckCircle />} label="Status" value={a.status} />
    <DetailRow icon={<FaFileMedical />} label="Prescription" value={a.prescription} />
  </div>
);

const DashboardView = ({ stats, appointments, doctors, formatDate, onGoToTab, onView }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard icon={<FaUserMd className="text-3xl" />} title="Doctors in Hospital" count={stats.totalDoctors} color="blue" onClick={() => onGoToTab('doctors')} />
      <StatCard icon={<FaUsers className="text-3xl" />} title="Patients Served" count={stats.totalPatients} color="green" onClick={() => onGoToTab('patients')} />
      <StatCard icon={<FaCalendarAlt className="text-3xl" />} title="Today's Appointments" count={stats.todayAppointments} color="purple" onClick={() => onGoToTab('appointments')} />
      <StatCard icon={<FaClock className="text-3xl" />} title="Awaiting Super-Admin" count={stats.pendingApprovals} color="yellow" onClick={() => onGoToTab('doctors')} />
    </div>

    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaChartLine className="text-green-600" /> Recent Appointments</h3>
        {appointments.length > 0 ? (
          <ul className="space-y-3">
            {appointments.map(apt => (
              <ActivityLog
                key={apt._id}
                item={`${apt.patientName} — ${apt.doctorId?.fullName ? 'Dr. ' + apt.doctorId.fullName : 'Doctor'}`}
                time={`${formatDate(apt.appointmentDate)} • ${apt.appointmentTime || ''}`}
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
          <QuickActionBtn icon={<FaUserMd />} label="Doctors" onClick={() => onGoToTab('doctors')} />
          <QuickActionBtn icon={<FaUsers />} label="Patients" onClick={() => onGoToTab('patients')} />
          <QuickActionBtn icon={<FaCalendarAlt />} label="Appointments" onClick={() => onGoToTab('appointments')} />
          <QuickActionBtn icon={<FaFileMedical />} label="Reports" onClick={() => onGoToTab('reports')} />
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4">Doctors awaiting super-admin approval</h3>
      {doctors.filter(d => d.isApproved === false).length > 0 ? (
        <div className="space-y-3">
          {doctors.filter(d => d.isApproved === false).slice(0, 4).map(doc => (
            <div key={doc._id} className="border rounded-lg p-4 flex justify-between items-center gap-3 flex-wrap">
              <div className="min-w-0">
                <p className="font-semibold">Dr. {doc.fullName || doc.username}</p>
                <p className="text-sm text-gray-600">{doc.specialization || 'General'} • License: {doc.licenseNumber || 'N/A'}</p>
                <p className="text-xs text-yellow-700">Pending super-administrator approval</p>
              </div>
              <button onClick={() => onView(doc)} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200" title="View"><FaEye /></button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">All your doctors are approved.</p>
      )}
    </div>
  </>
);

const DoctorsView = ({ doctors, onDelete, onRegister, onView }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showRegister, setShowRegister] = useState(false);
  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    const matchQ = !q || (d.fullName || '').toLowerCase().includes(q) || (d.email || '').toLowerCase().includes(q) || (d.specialization || '').toLowerCase().includes(q);
    const matchF = filter === 'all' || (filter === 'pending' && !d.isApproved) || (filter === 'approved' && d.isApproved);
    return matchQ && matchF;
  });

  return (
    <>
      {showRegister && (
        <RegisterDoctorModal
          onClose={() => setShowRegister(false)}
          onSubmit={async (payload) => {
            const ok = await onRegister(payload);
            if (ok) setShowRegister(false);
          }}
        />
      )}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">Doctors in your hospital ({filtered.length})</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="pl-9 pr-3 py-2 border rounded-lg w-full sm:w-64" />
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 border rounded-lg">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
            <button onClick={() => setShowRegister(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 whitespace-nowrap">
              <FaPlus /> Add Doctor
            </button>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map(doc => (
              <div key={doc._id} className="border rounded-lg p-4 flex justify-between items-center gap-3 flex-wrap hover:shadow-sm transition-shadow">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Dr. {doc.fullName || doc.username}</p>
                  <p className="text-sm text-gray-600">{doc.specialization || 'General'} • License: {doc.licenseNumber || 'N/A'}</p>
                  <p className="text-xs text-gray-500 truncate">{doc.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${doc.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {doc.isApproved ? 'Active' : 'Awaiting Super-Admin'}
                  </span>
                  <button onClick={() => onView(doc)} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200" title="View"><FaEye /></button>
                  <button onClick={() => onDelete(doc._id, `Dr. ${doc.fullName || doc.username}`)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Delete"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaUserMd className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-500">No doctors in your hospital yet.</p>
            <button onClick={() => setShowRegister(true)} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center gap-2">
              <FaPlus /> Register the first doctor
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const RegisterDoctorModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    username: '', fullName: '', email: '', password: '',
    phone: '', gender: '', specialization: '', licenseNumber: '',
    experience: '', consultationFee: '', bio: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.specialization || !form.licenseNumber) return;
    setSubmitting(true);
    const payload = { ...form, consultationFee: Number(form.consultationFee) || 0 };
    await onSubmit(payload);
    setSubmitting(false);
  };

  return (
    <Modal title="Register a doctor for your hospital" onClose={onClose}>
      <p className="text-sm text-gray-600 mb-4">The doctor will be linked to your hospital automatically and will be activated only after the super administrator approves the account.</p>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
        <Field label="Username" value={form.username} onChange={upd('username')} required />
        <Field label="Full name" value={form.fullName} onChange={upd('fullName')} />
        <Field label="Email" type="email" value={form.email} onChange={upd('email')} required />
        <Field label="Password" type="password" value={form.password} onChange={upd('password')} required />
        <Field label="Specialization" value={form.specialization} onChange={upd('specialization')} required />
        <Field label="License number" value={form.licenseNumber} onChange={upd('licenseNumber')} required />
        <Field label="Phone" value={form.phone} onChange={upd('phone')} />
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Gender</span>
          <select value={form.gender} onChange={upd('gender')} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="">Select…</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <Field label="Experience" value={form.experience} onChange={upd('experience')} />
        <Field label="Consultation fee" type="number" value={form.consultationFee} onChange={upd('consultationFee')} />
        <div className="md:col-span-2">
          <Field label="Short bio" value={form.bio} onChange={upd('bio')} textarea />
        </div>
        <div className="md:col-span-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={submitting} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
            <FaPlus /> {submitting ? 'Submitting…' : 'Register'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const PatientsView = ({ patients, formatDate, onView }) => {
  const [search, setSearch] = useState('');
  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    return !q || (p.fullName || '').toLowerCase().includes(q) || (p.email || '').toLowerCase().includes(q);
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">Registered Patients ({filtered.length})</h2>
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients…" className="pl-9 pr-3 py-2 border rounded-lg w-full" />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <p className="font-semibold">{p.fullName || p.username}</p>
              <p className="text-sm text-gray-600 truncate">{p.email}</p>
              <p className="text-xs text-gray-500 mt-1">Joined: {formatDate(p.createdAt)}</p>
              <button onClick={() => onView(p)} className="mt-3 w-full px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm flex items-center justify-center gap-1">
                <FaEye /> View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaUsers className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-500">No patients found</p>
        </div>
      )}
    </div>
  );
};

const AppointmentsView = ({ appointments, formatDate, onCancel, onStatus, onView }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const filtered = appointments.filter(a => {
    const q = search.toLowerCase();
    const matchQ = !q || (a.patientName || '').toLowerCase().includes(q) || (a.doctorId?.fullName || '').toLowerCase().includes(q);
    const matchS = statusFilter === 'all' || a.status === statusFilter;
    return matchQ && matchS;
  });

  const statusColors = {
    Confirmed: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-blue-100 text-blue-700',
    Cancelled: 'bg-red-100 text-red-700',
    NoShow: 'bg-gray-200 text-gray-700',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">Appointments ({filtered.length})</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="pl-9 pr-3 py-2 border rounded-lg w-full sm:w-56" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg">
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="NoShow">No Show</option>
          </select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(a => (
            <div key={a._id} className="border rounded-lg p-4 flex justify-between items-center gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{a.patientName}</p>
                <p className="text-sm text-gray-600">{a.doctorId?.fullName ? `Dr. ${a.doctorId.fullName}` : 'Doctor'} • {formatDate(a.appointmentDate)} at {a.appointmentTime}</p>
                {a.symptoms && <p className="text-xs text-gray-500 truncate mt-1">Symptoms: {a.symptoms}</p>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[a.status] || 'bg-gray-100 text-gray-700'}`}>{a.status}</span>
                <button onClick={() => onView(a)} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200" title="View"><FaEye /></button>
                {a.status === 'Pending' && (
                  <button onClick={() => onStatus(a._id, 'Confirmed')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Confirm</button>
                )}
                {(a.status === 'Pending' || a.status === 'Confirmed') && (
                  <>
                    <button onClick={() => onStatus(a._id, 'Completed')} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Complete</button>
                    <button onClick={() => onCancel(a._id)} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Cancel</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaCalendarAlt className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-500">No appointments match your filters</p>
        </div>
      )}
    </div>
  );
};

const ReportsView = ({ stats, appointments, doctors }) => {
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;
  const pending = appointments.filter(a => a.status === 'Pending').length;
  const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
  const completionRate = appointments.length > 0 ? Math.round((completed / appointments.length) * 100) : 0;
  const approvedDoctors = doctors.filter(d => d.isApproved).length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <ReportCard title="Total Appointments" value={appointments.length} change={`${stats.todayAppointments} today`} />
          <ReportCard title="Completion Rate" value={`${completionRate}%`} change={`${completed} completed`} />
          <ReportCard title="Cancellation Rate" value={`${appointments.length ? Math.round((cancelled / appointments.length) * 100) : 0}%`} change={`${cancelled} cancelled`} />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniStat label="Pending" value={pending} color="yellow" />
          <MiniStat label="Confirmed" value={confirmed} color="green" />
          <MiniStat label="Completed" value={completed} color="blue" />
          <MiniStat label="Cancelled" value={cancelled} color="red" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Doctors Summary</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.totalDoctors}</p>
          <p className="text-sm text-gray-500">Total registered doctors</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm"><span>Approved:</span><span className="font-semibold text-green-600">{approvedDoctors}</span></div>
            <div className="flex justify-between text-sm"><span>Pending approval:</span><span className="font-semibold text-yellow-600">{stats.pendingApprovals}</span></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Patients Summary</h3>
          <p className="text-4xl font-bold text-green-600">{stats.totalPatients}</p>
          <p className="text-sm text-gray-500">Registered patients across the platform</p>
        </div>
      </div>
    </div>
  );
};

const SettingsView = ({ hospital, hospitalName, onSave }) => {
  const [form, setForm] = useState({
    name: hospital?.name || hospitalName || '',
    description: hospital?.description || '',
    phone: hospital?.phone || '',
    email: hospital?.email || '',
    website: hospital?.website || '',
    line1: hospital?.address?.line1 || '',
    city: hospital?.address?.city || '',
    state: hospital?.address?.state || '',
    country: hospital?.address?.country || '',
    postalCode: hospital?.address?.postalCode || '',
  });

  useEffect(() => {
    if (hospital) {
      setForm({
        name: hospital.name || '',
        description: hospital.description || '',
        phone: hospital.phone || '',
        email: hospital.email || '',
        website: hospital.website || '',
        line1: hospital.address?.line1 || '',
        city: hospital.address?.city || '',
        state: hospital.address?.state || '',
        country: hospital.address?.country || '',
        postalCode: hospital.address?.postalCode || '',
      });
    }
  }, [hospital]);

  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: form.name,
      description: form.description,
      phone: form.phone,
      email: form.email,
      website: form.website,
      address: {
        line1: form.line1, city: form.city, state: form.state,
        country: form.country, postalCode: form.postalCode,
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Hospital Settings</h2>
      {!hospital ? (
        <p className="text-gray-500 mb-4">Hospital record not linked to your account. You can still edit local fields below.</p>
      ) : null}
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <Field label="Hospital Name" value={form.name} onChange={upd('name')} required />
        <Field label="Email" value={form.email} onChange={upd('email')} type="email" />
        <Field label="Phone" value={form.phone} onChange={upd('phone')} />
        <Field label="Website" value={form.website} onChange={upd('website')} />
        <div className="md:col-span-2">
          <Field label="Description" value={form.description} onChange={upd('description')} textarea />
        </div>
        <Field label="Street Address" value={form.line1} onChange={upd('line1')} />
        <Field label="City" value={form.city} onChange={upd('city')} />
        <Field label="State" value={form.state} onChange={upd('state')} />
        <Field label="Country" value={form.country} onChange={upd('country')} />
        <Field label="Postal Code" value={form.postalCode} onChange={upd('postalCode')} />
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <FaSave /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, value, onChange, type = 'text', required, textarea }) => (
  <label className="block">
    <span className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</span>
    {textarea ? (
      <textarea value={value} onChange={onChange} required={required} rows={3} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
    ) : (
      <input type={type} value={value} onChange={onChange} required={required} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
    )}
  </label>
);

const StatCard = ({ icon, title, count, color, onClick }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    yellow: 'text-yellow-600 bg-yellow-50',
  };
  return (
    <button onClick={onClick} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-left">
      <div className={`${colors[color] || 'text-gray-600 bg-gray-50'} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">{count}</p>
    </button>
  );
};

const ActivityLog = ({ item, time, type }) => {
  const colors = {
    success: 'border-green-200 bg-green-50',
    info: 'border-blue-200 bg-blue-50',
    warning: 'border-yellow-200 bg-yellow-50',
  };
  return (
    <li className={`border-l-4 ${colors[type] || 'border-gray-200 bg-gray-50'} p-3 rounded`}>
      <p className="font-medium text-gray-800">{item}</p>
      <p className="text-sm text-gray-500">{time}</p>
    </li>
  );
};

const QuickActionBtn = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
    <div className="text-2xl text-gray-600 group-hover:text-green-600 mb-2">{icon}</div>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const ReportCard = ({ title, value, change }) => (
  <div className="bg-gray-50 rounded-xl p-6">
    <p className="text-gray-600 mb-2">{title}</p>
    <p className="text-3xl font-bold mb-1">{value}</p>
    <p className="text-sm text-gray-500">{change}</p>
  </div>
);

const MiniStat = ({ label, value, color }) => {
  const colors = {
    yellow: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    green: 'text-green-700 bg-green-50 border-green-200',
    blue: 'text-blue-700 bg-blue-50 border-blue-200',
    red: 'text-red-700 bg-red-50 border-red-200',
  };
  return (
    <div className={`border rounded-lg p-4 ${colors[color]}`}>
      <p className="text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default HospitalAdminDashboard;
