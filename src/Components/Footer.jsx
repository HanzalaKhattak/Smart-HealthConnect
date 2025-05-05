import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white pt-10 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-xl font-bold mb-4">Smart HealthConnect</h2>
          <p className="text-sm">A unified healthcare platform for patients, doctors, hospitals, and administrators. Improving access, coordination, and management of health services through smart digital integration.</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/services" className="hover:underline">Our Services</a></li>
            <li><a href="/register" className="hover:underline">Register</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Info</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center"><FaMapMarkerAlt className="mr-2" /> 123 Health St, Peshawar, Pakistan</li>
            <li className="flex items-center"><FaPhoneAlt className="mr-2" /> +92 300 1234567</li>
            <li className="flex items-center"><FaEnvelope className="mr-2" /> info@smarthealthconnect.com</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-green-400"><FaFacebookF /></a>
            <a href="#" className="hover:text-green-400"><FaTwitter /></a>
            <a href="#" className="hover:text-green-400"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm mt-8 border-t border-green-800 pt-4">
        &copy; {new Date().getFullYear()} Smart HealthConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
