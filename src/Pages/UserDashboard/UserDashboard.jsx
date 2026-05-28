import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaStethoscope, FaUserMd, FaPills, FaHeartbeat, FaBell, FaUserCircle, 
  FaRobot, FaQuestionCircle, FaPhoneAlt, FaSignOutAlt, FaCalendarAlt,
  FaHospital, FaFileAlt, FaStar, FaClock, FaCheck, FaTimes, FaChartLine,
  FaVideo, FaBars
} from 'react-icons/fa';
import axios from 'axios';
import { API_Doctor, API_Appointment } from '../../Components/apis/apisUrl';
import { Get_All_Doctors, Get_Patient_Appointments, Get_Patient_Prescriptions } from '../../Components/apis/endpoints';

const UserDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const userId = localStorage.getItem('userId');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    appointmentsThisMonth: 0,
    healthRecords: 0,
    activePrescriptions: 0,
    totalVisits: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Fetch appointments
      if (userId) {
        try {
          const appointmentsRes = await axios.get(`${API_Appointment}${Get_Patient_Appointments}/${userId}`, { headers });
          const appointmentsData = appointmentsRes.data.appointments || appointmentsRes.data || [];
          setAppointments(appointmentsData);
          
          // Calculate stats
          const thisMonth = new Date().getMonth();
          const appointmentsThisMonth = appointmentsData.filter(apt => 
            new Date(apt.appointmentDate).getMonth() === thisMonth
          ).length;
          
          setStats(prev => ({
            ...prev,
            appointmentsThisMonth,
            totalVisits: appointmentsData.filter(apt => apt.status === 'Completed').length
          }));
        } catch (err) {
          console.log('No appointments found or error:', err);
          setAppointments([]);
        }

        // Fetch prescriptions
        try {
          const prescriptionsRes = await axios.get(`${API_Appointment}${Get_Patient_Prescriptions}/${userId}/prescriptions`, { headers });
          const prescriptionsData = prescriptionsRes.data.prescriptions || [];
          setPrescriptions(prescriptionsData);
          setStats(prev => ({ ...prev, activePrescriptions: prescriptionsData.length }));
        } catch (err) {
          console.log('Error fetching prescriptions:', err);
          setPrescriptions([]);
        }
      }

      // Fetch doctors
      try {
        const doctorsRes = await axios.get(API_Doctor + Get_All_Doctors);
        const doctorsData = doctorsRes.data.Doctors || doctorsRes.data || [];
        setDoctors(doctorsData);
      } catch (err) {
        console.log('Error fetching doctors:', err);
        setDoctors([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointments
      .filter(apt => new Date(apt.appointmentDate) >= today && apt.status !== 'Cancelled')
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gray-100 animate-fade-in">
      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar Navigation */}
        <aside className={`fixed md:sticky top-0 left-0 z-50 md:z-auto w-64 bg-white shadow-md min-h-screen p-6 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}>
          <nav className="flex flex-col gap-2">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-green-600 bg-green-50 font-semibold">
              <FaHeartbeat /> Dashboard
            </Link>
            <Link to="/ai-consultation" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
              <FaRobot /> AI Symptom Checker
            </Link>
            <Link to="/book-appointment" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
              <FaStethoscope /> Book Appointment
            </Link>
            <Link to="/find-doctors" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
              <FaUserMd /> Find Doctors
            </Link>
            <Link to="/find-pharmacies" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
              <FaPills /> Pharmacy & Orders
            </Link>
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
              <FaUserCircle /> My Profile
            </Link>
            <Link to="/faq" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
              <FaQuestionCircle /> Help & FAQ
            </Link>
            <Link to="/contact" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
              <FaPhoneAlt /> Contact Support
            </Link>
            <hr className="my-2" />
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 w-full min-w-0">
          {/* Mobile Header with menu toggle */}
          <div className="md:hidden flex items-center gap-3 mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-white rounded-lg shadow text-gray-700"
              aria-label="Open menu"
            >
              <FaBars />
            </button>
            <h2 className="text-lg font-bold text-gray-800">Dashboard</h2>
          </div>

          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 sm:p-6 rounded-xl shadow-lg mb-6 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Welcome back, {username}!</h2>
                <p className="text-green-100 mt-2">Hope you're feeling well today</p>
                <Link 
                  to="/ai-consultation"
                  className="inline-block mt-4 px-6 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
                >
                  Start Health Check
                </Link>
              </div>
              <button className="relative p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <FaBell className="text-white text-xl" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
            </div>
          </div>

          {/* Health Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <HealthStatCard icon={<FaCalendarAlt />} label="Appointments" value={stats.appointmentsThisMonth.toString()} sublabel="This Month" />
            <HealthStatCard icon={<FaFileAlt />} label="Health Records" value={stats.healthRecords.toString()} sublabel="Documents" />
            <HealthStatCard icon={<FaPills />} label="Prescriptions" value={stats.activePrescriptions.toString()} sublabel="Active" />
            <HealthStatCard icon={<FaHospital />} label="Visits" value={stats.totalVisits.toString()} sublabel="Completed" />
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-md mb-6 overflow-x-auto">
            <div className="flex border-b min-w-max">
              <TabButton label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
              <TabButton label="Appointments" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
              <TabButton label="Prescriptions" active={activeTab === 'prescriptions'} onClick={() => setActiveTab('prescriptions')} />
              <TabButton label="Health Records" active={activeTab === 'records'} onClick={() => setActiveTab('records')} />
              <TabButton label="Doctors" active={activeTab === 'doctors'} onClick={() => setActiveTab('doctors')} />
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <>
              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 animate-stagger">
                <ActionCard icon={<FaRobot />} label="AI Checker" onClick={() => navigate('/ai-consultation')} />
                <ActionCard icon={<FaStethoscope />} label="Book Appointment" onClick={() => navigate('/book-appointment')} />
                <ActionCard icon={<FaPills />} label="Order Medicines" onClick={() => navigate('/find-pharmacies')} />
                <ActionCard icon={<FaUserMd />} label="Find Doctors" onClick={() => navigate('/find-doctors')} />
                <ActionCard icon={<FaHeartbeat />} label="Health Tips" onClick={() => navigate('/faq')} />
                <ActionCard icon={<FaUserCircle />} label="Edit Profile" onClick={() => navigate('/profile')} />
              </div>

              {/* Recent Activity & Health Tips Grid */}
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-green-600" /> Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <ActivityItem text="Appointment booked with Dr. Sarah Khan" time="2 hours ago" type="success" />
                    <ActivityItem text="Lab results uploaded" time="1 day ago" type="info" />
                    <ActivityItem text="Prescription renewed" time="3 days ago" type="success" />
                  </div>
                </div>

                {/* Health Tips */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Daily Health Tips</h3>
                  <div className="space-y-3">
                    <HealthTip title="Stay Hydrated" description="Drink at least 8 glasses of water daily" />
                    <HealthTip title="Regular Exercise" description="30 minutes of activity keeps you healthy" />
                    <HealthTip title="Healthy Diet" description="Include fruits and vegetables in meals" />
                  </div>
                </div>
              </div>

              {/* Upcoming Appointments Preview */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
                  <button onClick={() => setActiveTab('appointments')} className="text-green-600 text-sm hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    </div>
                  ) : getUpcomingAppointments().length > 0 ? (
                    getUpcomingAppointments().map((apt) => (
                      <AppointmentCard 
                        key={apt._id}
                        id={apt._id}
                        name={`Dr. ${apt.doctorId?.username || 'Unknown'}`} 
                        specialty={apt.doctorId?.specialization || 'Specialist'} 
                        time={`${apt.appointmentTime}, ${formatDate(apt.appointmentDate)}`} 
                        status={apt.status} 
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">All Appointments</h3>
                  <button 
                    onClick={() => navigate('/book-appointment')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Book New
                  </button>
                </div>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    </div>
                  ) : appointments.length > 0 ? (
                    appointments.map((apt) => (
                      <AppointmentCard 
                        key={apt._id}
                        id={apt._id}
                        name={`Dr. ${apt.doctorId?.username || 'Unknown'}`} 
                        specialty={apt.doctorId?.specialization || 'Specialist'} 
                        time={`${apt.appointmentTime}, ${formatDate(apt.appointmentDate)}`} 
                        status={apt.status} 
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaCalendarAlt className="text-gray-300 text-5xl mx-auto mb-4" />
                      <p className="text-gray-500">No appointments yet</p>
                      <button 
                        onClick={() => navigate('/book-appointment')}
                        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Book Your First Appointment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaPills className="text-green-600" /> My Prescriptions
                </h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
                  </div>
                ) : prescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {prescriptions.map((apt) => (
                      <PrescriptionCard
                        key={apt._id}
                        doctorName={`Dr. ${apt.doctorId?.username || 'Unknown'}`}
                        specialization={apt.doctorId?.specialization || 'Specialist'}
                        date={apt.appointmentDate}
                        prescription={apt.prescription}
                        doctorNotes={apt.doctorNotes}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <FaPills className="text-gray-300 text-5xl mx-auto mb-4" />
                    <p className="text-gray-500">No prescriptions yet</p>
                    <p className="text-sm text-gray-400 mt-1">Prescriptions will appear here after your doctor completes an appointment</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">My Health Records</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <HealthRecordCard title="Blood Test Results" date="Jan 28, 2026" type="Lab Report" />
                  <HealthRecordCard title="X-Ray Report" date="Jan 20, 2026" type="Imaging" />
                  <HealthRecordCard title="Prescription" date="Jan 15, 2026" type="Medication" />
                  <HealthRecordCard title="Consultation Notes" date="Jan 10, 2026" type="Doctor Notes" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Available Doctors</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
                </div>
              ) : doctors.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {doctors.map((doctor) => (
                    <DoctorCard 
                      key={doctor._id}
                      id={doctor._id}
                      name={`Dr. ${doctor.username}`} 
                      specialty={doctor.specialization || 'General Physician'} 
                      rating="4.8" 
                      experience={doctor.experience || 'Experienced'}
                      onBook={() => navigate('/book-appointment')}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No doctors available</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const ActionCard = ({ icon, label, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105"
  >
    <div className="text-green-600 text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
    <p className="text-sm text-center font-medium">{label}</p>
  </div>
);

const HealthStatCard = ({ icon, label, value, sublabel }) => (
  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-green-600 text-2xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
    <p className="text-xs text-gray-400">{sublabel}</p>
  </div>
);

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
      active ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'
    }`}
  >
    {label}
  </button>
);

const ActivityItem = ({ text, time, type }) => {
  const colors = {
    success: 'border-green-200 bg-green-50',
    info: 'border-blue-200 bg-blue-50'
  };
  return (
    <div className={`border-l-4 ${colors[type]} p-3 rounded`}>
      <p className="text-sm font-medium text-gray-800">{text}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  );
};

const HealthTip = ({ title, description }) => (
  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
    <FaCheck className="text-green-600 mt-1" />
    <div>
      <p className="font-semibold text-gray-800 text-sm">{title}</p>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  </div>
);

const DoctorCard = ({ name, specialty, rating, experience, onBook }) => (
  <div className="border p-4 rounded-xl shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-start justify-between mb-2">
      <div>
        <h4 className="font-bold text-lg text-gray-800">{name}</h4>
        <p className="text-gray-600 text-sm">{specialty}</p>
      </div>
      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
        <FaStar className="text-yellow-500 text-sm" />
        <span className="text-sm font-medium">{rating}</span>
      </div>
    </div>
    <p className="text-xs text-gray-500 mb-3">{experience}</p>
    <button 
      onClick={onBook}
      className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
    >
      Book Appointment
    </button>
  </div>
);

const AppointmentCard = ({ id, name, specialty, time, status }) => {
  const statusColors = {
    'Confirmed': 'bg-green-100 text-green-700',
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Cancelled': 'bg-red-100 text-red-700',
    'Completed': 'bg-blue-100 text-blue-700'
  };
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-600">{specialty}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <FaClock className="text-xs" />
            <span>{time}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status}
          </span>
          {(status === 'Confirmed' || status === 'Pending') && id && (
            <Link
              to={`/session/${id}`}
              className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1"
            >
              <FaVideo className="text-xs" /> Join Video
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const PrescriptionCard = ({ doctorName, specialization, date, prescription, doctorNotes }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return (
    <div className="border border-green-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-green-50/30">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-gray-800 text-lg">{doctorName}</p>
          <p className="text-sm text-green-600">{specialization}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border rounded-full px-3 py-1">
          <FaCalendarAlt />
          <span>{formattedDate}</span>
        </div>
      </div>
      <div className="bg-white border border-green-100 rounded-lg p-4 mb-3">
        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Prescription</p>
        <p className="text-gray-700 text-sm whitespace-pre-line">{prescription}</p>
      </div>
      {doctorNotes && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Doctor's Notes</p>
          <p className="text-gray-700 text-sm whitespace-pre-line">{doctorNotes}</p>
        </div>
      )}
    </div>
  );
};

const HealthRecordCard = ({ title, date, type }) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group">
    <div className="flex items-start justify-between">
      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{type}</p>
      </div>
      <FaFileAlt className="text-green-600 text-xl group-hover:scale-110 transition-transform" />
    </div>
    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
      <FaCalendarAlt />
      <span>{date}</span>
    </div>
    <button className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium">View Document →</button>
  </div>
);

export default UserDashboard;
