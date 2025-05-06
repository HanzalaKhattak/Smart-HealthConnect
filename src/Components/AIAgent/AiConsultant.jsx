import React, { useState } from 'react';

const AiConsultant = () => {
  const [symptoms, setSymptoms] = useState('');
  const [doctorType, setDoctorType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple logic for mapping symptoms to doctor types (you can expand this later)
    const symptomLower = symptoms.toLowerCase();

    if (symptomLower.includes('tooth') || symptomLower.includes('gum')) {
      setDoctorType('You should visit a Dentist.');
    } else if (symptomLower.includes('heart') || symptomLower.includes('chest pain')) {
      setDoctorType('You should consult a Cardiologist.');
    } else if (symptomLower.includes('skin') || symptomLower.includes('rash')) {
      setDoctorType('You should see a Dermatologist.');
    } else if (symptomLower.includes('fever') || symptomLower.includes('cough')) {
      setDoctorType('You should visit a General Physician.');
    } else {
      setDoctorType('Please consult a General Physician for further diagnosis.');
    }
  };

  return (
    <div className='p-6 max-w-xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4'>AI Medical Assistant</h1>
      <form onSubmit={handleSubmit}>
        <label className='block mb-2 text-lg font-medium'>Describe your symptoms:</label>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className='w-full border border-gray-300 rounded p-2 mb-4'
          rows='5'
          required
        />
        <button
          type='submit'
          className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
        >
          Get Doctor Suggestion
        </button>
      </form>

      {doctorType && (
        <div className='mt-6 p-4 bg-green-100 border border-green-400 rounded'>
          <p className='text-xl font-semibold'>{doctorType}</p>
        </div>
      )}
    </div>
  );
};

export default AiConsultant;
