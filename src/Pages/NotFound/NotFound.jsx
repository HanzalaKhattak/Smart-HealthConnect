import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft, FaHome, FaQuestionCircle } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <FaExclamationTriangle className="mx-auto text-6xl text-yellow-500" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for seems to have disappeared into the digital void.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            <FaArrowLeft />
            Go Back
          </button>

          <div className="flex gap-4">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition"
            >
              <FaHome />
              Home
            </Link>

            <Link
              to="/faq"
              className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition"
            >
              <FaQuestionCircle />
              Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
