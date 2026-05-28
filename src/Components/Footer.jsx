import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-green-900 to-green-700 text-white pt-10 pb-6 mt-10 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4 tracking-tight">Smart HealthConnect</h2>
          <p className="text-sm text-green-100">A unified healthcare platform for patients, doctors, hospitals, and administrators. Improving access, coordination, and management of health services through smart digital integration.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:underline hover:text-green-200 transition text-green-100">About Us</a></li>
            <li><a href="/services" className="hover:underline hover:text-green-200 transition text-green-100">Our Services</a></li>
            <li><a href="/register" className="hover:underline hover:text-green-200 transition text-green-100">Register</a></li>
            <li><a href="/contact" className="hover:underline hover:text-green-200 transition text-green-100">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Info</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center"><FaMapMarkerAlt className="mr-2" aria-hidden="true" /> 123 Health St, Peshawar, Pakistan</li>
            <li className="flex items-center"><FaPhoneAlt className="mr-2" aria-hidden="true" /> +92 300 1234567</li>
            <li className="flex items-center"><FaEnvelope className="mr-2" aria-hidden="true" /> info@smarthealthconnect.com</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className="hover:text-green-300 transition text-xl"><FaFacebookF aria-hidden="true" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-green-300 transition text-xl"><FaTwitter aria-hidden="true" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-green-300 transition text-xl"><FaLinkedinIn aria-hidden="true" /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-sm mt-8 border-t border-green-800 pt-4 text-green-100">
        &copy; {new Date().getFullYear()} Smart HealthConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
