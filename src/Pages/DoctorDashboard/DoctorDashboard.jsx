import React, { useState, useEffect } from 'react';
import { 
  FaCalendarCheck, FaUserInjured, FaComments, FaNotesMedical, FaBell, FaUserMd,
  FaChartLine, FaSignOutAlt, FaClock, FaCheckCircle, FaStar, FaEdit,
  FaFileMedical, FaUsers, FaClipboardList, FaCog, FaVideo
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_Appointment } from '../../Components/apis/apisUrl';
import { Get_Doctor_Appointments, Update_Appointment } from '../../Components/apis/endpoints';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState('Doctor');
  const [doctorId, setDoctorId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionAppointment, setSessionAppointment] = useState(null);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingReviews: 0,
    rating: '4.8'
  });

  useEffect(() => {
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('userId');
    setDoctorName(username || 'Doctor');
    setDoctorId(id);
    
    if (id) {
      fetchAppointments(id);
    }
  }, []);

  const fetchAppointments = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_Appointment}${Get_Doctor_Appointments}/${id}`);
      const appointmentsData = response.data.appointments || response.data || [];
      setAppointments(appointmentsData);
      
      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayApts = appointmentsData.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= today && aptDate < tomorrow;
      });
      
      const uniquePatients = [...new Set(appointmentsData.map(apt => apt.patientId?._id).filter(Boolean))];
      const pendingApts = appointmentsData.filter(apt => apt.status === 'Pending');
      
      setStats({
        todayAppointments: todayApts.length,
        totalPatients: uniquePatients.length,
        pendingReviews: pendingApts.length,
        rating: '4.8'
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus, extra = {}) => {
    try {
      await axios.put(`${API_Appointment}${Update_Appointment}/${appointmentId}`, { status: newStatus, ...extra });
      fetchAppointments(doctorId);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleCompleteSession = async (appointmentId, doctorNotes, prescription) => {
    await handleUpdateStatus(appointmentId, 'Completed', { doctorNotes, prescription });
    setSessionAppointment(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTodayAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= today && aptDate < tomorrow;
    }).sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-fade-in">
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
        <aside className="w-64 bg-white shadow-lg min-h-screen p-6 hidden md:block">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FaUserMd className="text-green-600 text-3xl" />
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Dr. {doctorName}</h2>
                <p className="text-xs text-gray-500">Doctor Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <NavItem 
              icon={<FaChartLine />} 
              label="Dashboard" 
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <NavItem 
              icon={<FaCalendarCheck />} 
              label="My Appointments" 
              active={activeTab === 'appointments'}
              onClick={() => setActiveTab('appointments')}
            />
            <NavItem 
              icon={<FaUserInjured />} 
              label="Patient Records" 
              active={activeTab === 'patients'}
              onClick={() => setActiveTab('patients')}
            />
            <NavItem 
              icon={<FaNotesMedical />} 
              label="Prescriptions" 
              active={activeTab === 'prescriptions'}
              onClick={() => setActiveTab('prescriptions')}
            />
            <NavItem 
              icon={<FaComments />} 
              label="Messages" 
              active={activeTab === 'messages'}
              onClick={() => setActiveTab('messages')}
            />
            <Link to="/doctor/edit-profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
              <FaEdit /> Edit Profile
            </Link>
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
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, Dr. {doctorName}!</h1>
                <p className="text-gray-600 mt-1">Here's your schedule and patient overview</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-3 bg-green-50 rounded-full hover:bg-green-100 transition-colors">
                  <FaBell className="text-green-600 text-xl" />
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">4</span>
                </button>
              </div>
            </div>
          </div>

          {/* Render content based on active tab */}
          {activeTab === 'overview' && (
            <OverviewView 
              stats={stats} 
              appointments={getTodayAppointments()} 
              loading={loading}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'appointments' && (
            <AppointmentsView 
              appointments={appointments} 
              loading={loading}
              formatDate={formatDate}
              onUpdateStatus={handleUpdateStatus}
              onStartSession={setSessionAppointment}
            />
          )}

          {sessionAppointment && (
            <SessionModal
              appointment={sessionAppointment}
              onClose={() => setSessionAppointment(null)}
              onComplete={handleCompleteSession}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
          {activeTab === 'patients' && (
            <PatientsView 
              appointments={appointments}
              loading={loading}
            />
          )}
          {activeTab === 'prescriptions' && (
            <PrescriptionsView 
              appointments={appointments}
              loading={loading}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'messages' && <MessagesView />}
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
      active ? 'bg-green-50 text-green-600 font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
    }`}
  >
    {icon} <span>{label}</span>
  </button>
);

// Overview View
const OverviewView = ({ stats, appointments, loading }) => (
  <>
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 animate-stagger">
      <StatCard icon={<FaCalendarCheck className="text-3xl" />} title="Today's Appointments" count={stats.todayAppointments.toString()} color="blue" />
      <StatCard icon={<FaUsers className="text-3xl" />} title="Total Patients" count={stats.totalPatients.toString()} color="green" />
      <StatCard icon={<FaClock className="text-3xl" />} title="Pending Reviews" count={stats.pendingReviews.toString()} color="yellow" />
      <StatCard icon={<FaStar className="text-3xl" />} title="Rating" count={stats.rating} color="purple" />
    </div>

    {/* Today's Schedule & Quick Actions */}
    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaCalendarCheck className="text-green-600" /> Today's Schedule
        </h3>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.slice(0, 5).map((apt) => (
              <ScheduleItem 
                key={apt._id}
                time={apt.appointmentTime} 
                patient={apt.patientName} 
                type={apt.symptoms?.substring(0, 30) + '...' || 'Consultation'} 
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No appointments today</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <QuickActionBtn icon={<FaNotesMedical />} label="Write Prescription" />
          <QuickActionBtn icon={<FaVideo />} label="Start Consultation" />
          <QuickActionBtn icon={<FaClipboardList />} label="View Records" />
          <QuickActionBtn icon={<FaComments />} label="Messages" />
        </div>
      </div>
    </div>

    {/* Recent Patients & Messages */}
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Recent Patients</h3>
        <div className="space-y-3">
          <PatientQuickCard name="Ahmed Raza" lastVisit="Today" condition="Follow-up" />
          <PatientQuickCard name="Maria Khan" lastVisit="Yesterday" condition="Consultation" />
          <PatientQuickCard name="Omar Ali" lastVisit="2 days ago" condition="Check-up" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Recent Messages</h3>
        <div className="space-y-3">
          <MessageCard from="Ahmed Raza" content="Thanks for the advice!" time="2 hours ago" unread={true} />
          <MessageCard from="Zainab Fatima" content="Should I take medication at night?" time="5 hours ago" unread={false} />
          <MessageCard from="Bilal Khan" content="Feeling much better now" time="1 day ago" unread={false} />
        </div>
      </div>
    </div>
  </>
);

// Appointments View
const AppointmentsView = ({ appointments, loading, formatDate, onUpdateStatus, onStartSession }) => {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold">All Appointments</h2>
        <div className="flex gap-2 flex-wrap">
          {['all','Pending','Confirmed','Completed','Cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                filter === s ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 text-gray-600 hover:border-green-400'
              }`}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((apt) => (
            <AppointmentCard
              key={apt._id}
              appointment={apt}
              formatDate={formatDate}
              onUpdateStatus={onUpdateStatus}
              onStartSession={onStartSession}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaCalendarCheck className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-500">No appointments found</p>
        </div>
      )}
    </div>
  );
};

// Patients View
const PatientsView = ({ appointments, loading }) => {
  // Get unique patients from appointments
  const uniquePatients = [];
  const patientIds = new Set();
  
  appointments.forEach(apt => {
    if (apt.patientId && !patientIds.has(apt.patientId._id)) {
      patientIds.add(apt.patientId._id);
      uniquePatients.push({
        id: apt.patientId._id,
        name: apt.patientName,
        age: apt.patientAge,
        lastVisit: apt.appointmentDate,
        status: apt.status === 'Completed' ? 'Active' : 'Follow-up'
      });
    }
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">My Patients</h2>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : uniquePatients.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniquePatients.map((patient) => (
            <PatientCard 
              key={patient.id}
              name={patient.name} 
              age={patient.age?.toString()} 
              lastVisit={new Date(patient.lastVisit).toLocaleDateString()} 
              status={patient.status} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaUserInjured className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-500">No patients yet</p>
        </div>
      )}
    </div>
  );
};

// Prescriptions View
const PrescriptionsView = ({ appointments, loading, formatDate }) => {
  // Get completed appointments with prescriptions
  const prescriptions = appointments.filter(apt => apt.status === 'Completed' || apt.prescription);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Prescriptions</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <FaNotesMedical /> New Prescription
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : prescriptions.length > 0 ? (
          <div className="space-y-3">
            {prescriptions.map((apt) => (
              <PrescriptionCard 
                key={apt._id}
                patient={apt.patientName} 
                date={formatDate(apt.appointmentDate)} 
                medications={apt.prescription || 'No prescription added'} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaFileMedical className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-500">No prescriptions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Messages View
const MessagesView = () => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-2xl font-bold mb-6">Messages</h2>
    <div className="space-y-3">
      <MessageCard from="Ahmed Raza" content="Thanks for the advice, doctor! Feeling much better." time="2 hours ago" unread={true} />
      <MessageCard from="Zainab Fatima" content="Should I take the medication at night or morning?" time="5 hours ago" unread={true} />
      <MessageCard from="Bilal Khan" content="The test results are ready. When can I visit?" time="1 day ago" unread={false} />
      <MessageCard from="Sarah Ahmed" content="Thank you for the consultation yesterday." time="2 days ago" unread={false} />
    </div>
  </div>
);

// Settings View
const SettingsView = () => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-2xl font-bold mb-6">Settings</h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Availability</h3>
        <div className="space-y-2">
          <SettingItem label="Working Days" value="Mon - Fri" />
          <SettingItem label="Working Hours" value="9:00 AM - 5:00 PM" />
          <SettingItem label="Consultation Duration" value="30 minutes" />
        </div>
      </div>
      <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Update Settings</button>
    </div>
  </div>
);

// Component Definitions
const StatCard = ({ icon, title, count, color }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    purple: 'text-purple-600 bg-purple-50'
  };
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
      <div className={`${colors[color]} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
};

const ScheduleItem = ({ time, patient, type }) => (
  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="text-green-600 font-semibold">{time}</div>
    <div className="flex-1">
      <p className="font-medium text-gray-800">{patient}</p>
      <p className="text-xs text-gray-500">{type}</p>
    </div>
  </div>
);

const QuickActionBtn = ({ icon, label }) => (
  <button className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
    <div className="text-2xl text-gray-600 group-hover:text-green-600 mb-2">{icon}</div>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const PatientQuickCard = ({ name, lastVisit, condition }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
    <div>
      <p className="font-medium text-gray-800">{name}</p>
      <p className="text-xs text-gray-500">{condition}</p>
    </div>
    <span className="text-xs text-gray-400">{lastVisit}</span>
  </div>
);

const AppointmentCard = ({ appointment, formatDate, onUpdateStatus, onStartSession }) => {
  const { _id, patientName, patientAge, patientGender, contactNumber, appointmentTime, appointmentDate, symptoms, status, prescription, doctorNotes } = appointment;
  const statusColors = {
    'Confirmed': 'bg-green-100 text-green-700',
    'Pending':   'bg-yellow-100 text-yellow-700',
    'Completed': 'bg-blue-100 text-blue-700',
    'Cancelled': 'bg-red-100 text-red-700'
  };
  return (
    <div className="border rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-800 text-base">{patientName}</p>
            {patientAge && <span className="text-xs text-gray-500">({patientAge} yrs, {patientGender})</span>}
          </div>
          <p className="text-sm text-gray-600">🕐 {appointmentTime} &nbsp;|&nbsp; 📅 {formatDate(appointmentDate)}</p>
          <p className="text-sm text-gray-500">🩺 <span className="font-medium">Symptoms:</span> {symptoms?.substring(0, 80)}{symptoms?.length > 80 ? '…' : ''}</p>
          {contactNumber && <p className="text-xs text-gray-400">📞 {contactNumber}</p>}
          {doctorNotes && <p className="text-xs text-indigo-600 mt-1">📝 Notes: {doctorNotes.substring(0, 60)}…</p>}
          {prescription  && <p className="text-xs text-green-600">💊 Rx: {prescription.substring(0, 60)}…</p>}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
          </span>
          {status === 'Pending' && (
            <button
              onClick={() => onUpdateStatus(_id, 'Confirmed')}
              className="text-xs px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              ✓ Confirm
            </button>
          )}
          {(status === 'Confirmed' || status === 'Pending') && (
            <button
              onClick={() => onStartSession(appointment)}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
            >
              <FaVideo className="text-xs" /> Start Session
            </button>
          )}
          {(status === 'Confirmed' || status === 'Pending') && (
            <Link
              to={`/session/${_id}`}
              className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1"
            >
              <FaVideo className="text-xs" /> Video Call
            </Link>
          )}
          {status !== 'Cancelled' && status !== 'Completed' && (
            <button
              onClick={() => onUpdateStatus(_id, 'Cancelled')}
              className="text-xs px-3 py-1 border border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PatientCard = ({ name, age, lastVisit, status }) => {
  const statusColors = {
    'Active': 'bg-green-100 text-green-700',
    'Follow-up': 'bg-yellow-100 text-yellow-700'
  };
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-600">Age: {age}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      <p className="text-xs text-gray-500">Last visit: {lastVisit}</p>
      <button className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium">View Details →</button>
    </div>
  );
};

const PrescriptionCard = ({ patient, date, medications }) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-semibold text-gray-800">{patient}</p>
        <p className="text-sm text-gray-600">{medications}</p>
        <p className="text-xs text-gray-500 mt-1">{date}</p>
      </div>
      <FaFileMedical className="text-green-600 text-xl" />
    </div>
  </div>
);

const MessageCard = ({ from, content, time, unread }) => (
  <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${unread ? 'bg-green-50 border-green-200' : ''}`}>
    <div className="flex justify-between items-start mb-2">
      <p className="font-semibold text-gray-800">{from}</p>
      {unread && <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">New</span>}
    </div>
    <p className="text-gray-700 text-sm mb-1">{content}</p>
    <p className="text-xs text-gray-500">{time}</p>
  </div>
);

const SettingItem = ({ label, value }) => (
  <div className="flex justify-between items-center p-3 border-b">
    <span className="text-gray-700 font-medium">{label}</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

/* ════════════════════════════════════════════════════
   SESSION MODAL — doctor conducts the consultation
════════════════════════════════════════════════════ */
const SessionModal = ({ appointment, onClose, onComplete, onUpdateStatus }) => {
  const [doctorNotes, setDoctorNotes] = useState(appointment.doctorNotes || '');
  const [prescription, setPrescription] = useState(appointment.prescription || '');
  const [saving, setSaving] = useState(false);

  const {
    _id, patientName, patientAge, patientGender,
    contactNumber, appointmentTime, appointmentDate,
    symptoms, notes: patientNotes, status
  } = appointment;

  const handleComplete = async () => {
    setSaving(true);
    try {
      await onComplete(_id, doctorNotes, prescription);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    await onUpdateStatus(_id, 'Confirmed');
    // update local display
    appointment.status = 'Confirmed';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaVideo /> Consultation Session
            </h2>
            <p className="text-blue-100 text-sm mt-0.5">{appointmentTime} &nbsp;|&nbsp; {new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          </div>
          <button onClick={onClose} className="text-white text-2xl hover:text-blue-200 transition leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-5">

          {/* Patient Info */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <FaUserInjured className="text-blue-600" /> Patient Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Name"    value={patientName} />
              <Info label="Age"     value={patientAge ? `${patientAge} years` : '—'} />
              <Info label="Gender"  value={patientGender} />
              <Info label="Contact" value={contactNumber} />
            </div>
          </div>

          {/* Symptoms & Notes from patient */}
          <div className="bg-yellow-50 rounded-xl p-4">
            <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <FaNotesMedical className="text-yellow-600" /> Reported Symptoms
            </h3>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{symptoms || '—'}</p>
            {patientNotes && (
              <>
                <p className="font-medium text-yellow-700 mt-3 mb-1 text-sm">Patient Notes:</p>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{patientNotes}</p>
              </>
            )}
          </div>

          {/* Doctor Fields */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaNotesMedical className="text-indigo-500" /> Doctor Notes / Diagnosis
              </label>
              <textarea
                rows={4}
                value={doctorNotes}
                onChange={e => setDoctorNotes(e.target.value)}
                placeholder="Write your clinical notes, diagnosis, follow-up instructions…"
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                💊 Prescription
              </label>
              <textarea
                rows={4}
                value={prescription}
                onChange={e => setPrescription(e.target.value)}
                placeholder="e.g. Paracetamol 500mg – twice daily for 5 days, rest…"
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
            {status === 'Pending' && (
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition"
              >
                ✓ Confirm Appointment
              </button>
            )}
            <button
              onClick={handleComplete}
              disabled={saving}
              className={`px-5 py-2 rounded-lg text-white text-sm font-medium transition flex items-center gap-2 ${
                saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saving ? (
                <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Saving…</>
              ) : (
                <><FaCheckCircle /> Complete Session</>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value || '—'}</p>
  </div>
);

export default DoctorDashboard;
