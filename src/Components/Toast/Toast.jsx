import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const icons = {
    success: <FaCheckCircle className="text-xl" />,
    error: <FaExclamationCircle className="text-xl" />,
    info: <FaInfoCircle className="text-xl" />,
  };

  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg transition-all duration-300 ${styles[type]} ${
        isLeaving ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      {icons[type]}
      <span className="font-medium">{message}</span>
      <button onClick={handleClose} className="ml-2 hover:opacity-80">
        <FaTimes />
      </button>
    </div>
  );
};

// Toast Container for multiple toasts
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
