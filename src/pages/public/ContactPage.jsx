import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import apiClient from '../../services/http';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await apiClient.post('/contact/', formData); // Correct axios usage

    if (response.status === 200 || response.status === 201) {
      setSubmitMessage('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    setSubmitMessage('There was an error submitting your message. Please try again later.');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-red-600 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>

        
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                ></textarea>
              </div>

              <div>
<button
  type="submit"
  disabled={isSubmitting}
  className={`w-full bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition cursor-pointer ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
>
  {isSubmitting ? 'Sending...' : 'Send Message'}
</button>
              </div>

              {submitMessage && (
                <div className={`mt-4 p-3 rounded-md ${submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaPhone className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-500 text-sm mt-1">Saturday-Thursday, 10am-5pm</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaEnvelope className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">contact@roktofy.org</p>
                    <p className="text-gray-500 text-sm mt-1">We typically reply within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaMapMarkerAlt className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Headquarters</h3>
                    <p className="text-gray-600">123 Blood Drive Avenue</p>
                    <p className="text-gray-600">Dhaka,Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaClock className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Office Hours</h3>
                    <p className="text-gray-600">Saturday-Wednesday: 10:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">Thursday: 10:00 AM - 2:00 PM</p>
                    <p className="text-gray-600">Friday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Integration */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Our Location</h3>
              <div className="aspect-w-16 aspect-h-9">
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3638.173269706606!2d89.88800857440799!3d24.235717869973612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fdfc7edb573571%3A0xda791ddc1ce793bd!2sMawlana%20Bhashani%20Science%20and%20Technology%20University!5e0!3m2!1sen!2sbd!4v1747724600467!5m2!1sen!2sbd"
  width="100%"
  height="300"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Our Location"
  className="rounded-md w-full"
/>

                
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Banner */}
        <div className="mt-16 bg-red-600 text-white p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-2">Emergency Blood Need?</h3>
          <p className="mb-4">For urgent blood requests, please call our 24/7 emergency line:</p>
          <a href="tel:+15551234567" className="text-3xl font-bold hover:underline">
            +1 (***) EMERGENCY
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;