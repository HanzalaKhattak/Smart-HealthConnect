import React from 'react';
import { useNavigate } from 'react-router-dom';
import img2 from '../../Assets/AIAgentAssets/AIAgent.png';
import { AiOutlineRobot } from 'react-icons/ai';

const AIAgent = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/AiConsultant');
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div
        onClick={handleClick}
        className="cursor-pointer flex flex-col md:flex-row justify-between items-center w-full max-w-4xl border-2 border-green-500 rounded-2xl p-6 bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300"
      >
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <AiOutlineRobot className="text-3xl" />
            <h2 className="text-2xl md:text-3xl font-bold">Hello! I'm your AI Assistant</h2>
          </div>
          <p className="text-lg md:text-xl text-gray-700">
            Tell me about your symptoms and I’ll recommend the right doctor for you.
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-8">
          <img src={img2} alt="AI Assistant" className="w-40 md:w-48" />
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
