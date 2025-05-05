// Doctor.jsx
import { useParams } from 'react-router-dom';

const DoctorList = () => {
  const { specialization } = useParams();

  const doctors = [
    {
      name: 'Dr. John Doe',
      specialization: 'Cardiology',
      experience: '10 years',
      email: 'johndoe@hospital.com',
      image: 'https://randomuser.me/api/portraits/men/10.jpg',
      hospital: 'HeartCare Medical Center',
      clinic: '123 Main Street, New York, NY',
    },
    {
      name: 'Dr. Sarah Ali',
      specialization: 'Cardiology',
      experience: '7 years',
      email: 'sarahali@hospital.com',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      hospital: 'City Cardiac Hospital',
      clinic: '456 Park Avenue, New York, NY',
    },
    {
      name: 'Dr. Alex Smith',
      specialization: 'Neurology',
      experience: '5 years',
      email: 'alexsmith@hospital.com',
      image: 'https://randomuser.me/api/portraits/men/15.jpg',
      hospital: 'NeuroHealth Clinic',
      clinic: '321 Brain Street, Boston, MA',
    },
    {
      name: 'Dr. Maria Khan',
      specialization: 'Cardiology',
      experience: '9 years',
      email: 'mariakhan@hospital.com',
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      hospital: 'Advanced Heart Institute',
      clinic: '789 Wellness Blvd, Chicago, IL',
    },
  ];

  const filteredDoctors = doctors.filter(
    (doc) => doc.specialization === decodeURIComponent(specialization)
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Doctors in {specialization}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col items-center text-center"
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-green-500 mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{doc.name}</h2>
              <p className="text-sm text-green-600 font-medium mb-2">
                {doc.specialization}
              </p>
              <div className="text-gray-600 text-sm space-y-1">
                <p><span className="font-semibold">Email:</span> {doc.email}</p>
                <p><span className="font-semibold">Experience:</span> {doc.experience}</p>
                <p><span className="font-semibold">Hospital:</span> {doc.hospital}</p>
                <p><span className="font-semibold">Clinic:</span> {doc.clinic}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 text-lg">
            No doctors found for this specialization.
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
