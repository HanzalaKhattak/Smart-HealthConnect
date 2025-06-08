import React from 'react';
import { FaQuestion, FaArrowRight } from 'react-icons/fa';

const FAQ = () => {
  const faqs = [
    {
      question: "How do I book an appointment with a doctor?",
      answer: "You can book an appointment by navigating to the 'Find Doctors' section, selecting your preferred doctor, and choosing an available time slot. You'll need to be logged in to complete the booking."
    },
    {
      question: "What should I do if I need immediate medical attention?",
      answer: "For emergencies, please call emergency services immediately. Our platform is not intended for emergency medical situations. You can use our 'Nearby Hospitals' feature to locate the closest emergency room."
    },
    {
      question: "How does the AI symptom checker work?",
      answer: "Our AI symptom checker uses advanced algorithms to analyze your symptoms and suggest possible conditions. It's important to note that this is not a replacement for professional medical advice but rather a preliminary guide."
    },
    {
      question: "Can I get my prescriptions through the platform?",
      answer: "Yes, after your online consultation, doctors can send digital prescriptions through our platform which you can use at our partner pharmacies or any other pharmacy of your choice."
    },
    {
      question: "How secure is my medical information?",
      answer: "We take data security very seriously. All medical information is encrypted and stored securely following international healthcare data protection standards. Only authorized healthcare providers can access your information."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit/debit cards, online bank transfers, and mobile wallets. All payments are processed securely through our trusted payment partners."
    },
    {
      question: "How can I view my medical history?",
      answer: "You can access your complete medical history through your patient dashboard. This includes past appointments, prescriptions, test results, and other medical records shared by your healthcare providers."
    },
    {
      question: "What if I need to cancel or reschedule an appointment?",
      answer: "You can cancel or reschedule appointments through your dashboard up to 24 hours before the scheduled time. Please note that late cancellations might incur a fee as per our cancellation policy."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
            <FaQuestion className="text-green-600" />
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">Find answers to common questions about Smart HealthConnect</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <button
                className="w-full text-left p-6"
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 flex items-center gap-2">
                      {faq.question}
                      <FaArrowRight className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 text-center bg-green-50 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <button
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Contact Support
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
