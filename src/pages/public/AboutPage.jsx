import React from 'react';
import { FaHeartbeat, FaUsers, FaHandsHelping, FaShieldAlt } from 'react-icons/fa';
import { MdHealthAndSafety, MdOutlineConnectWithoutContact } from 'react-icons/md';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-red-600 sm:text-5xl sm:tracking-tight lg:text-6xl">
          About Roktofy
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Connecting blood donors with recipients in need - saving lives one donation at a time.
        </p>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8 sm:p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              Roktofy is dedicated to creating a reliable network between blood donors and those in 
              urgent need of blood transfusions. We aim to eliminate blood shortages in hospitals 
              and medical centers by making the donation process simple, efficient, and rewarding.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-red-100 p-3 rounded-full">
                  <FaHeartbeat className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Life-Saving Platform</h3>
                  <p className="mt-1 text-gray-600">
                    Instant connection between donors and recipients during emergencies.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-red-100 p-3 rounded-full">
                  <FaUsers className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Community Driven</h3>
                  <p className="mt-1 text-gray-600">
                    Built by and for the community to serve humanity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-red-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto mb-20 bg-red-600 rounded-xl text-white py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-4xl font-bold">1K+</p>
            <p className="text-red-100">Lives Saved</p>
          </div>
          <div>
            <p className="text-4xl font-bold">500+</p>
            <p className="text-red-100">Active Donors</p>
          </div>
          <div>
            <p className="text-4xl font-bold">100+</p>
            <p className="text-red-100">Partner Hospitals</p>
          </div>
          <div>
            <p className="text-4xl font-bold">24/7</p>
            <p className="text-red-100">Emergency Service</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">The Team Behind Roktofy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-full w-32 h-32 mx-auto mb-4 overflow-hidden shadow-md">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
              <p className="text-red-600">{member.role}</p>
              <p className="text-gray-600 text-sm mt-2">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Data for features
const features = [
  {
    icon: <MdHealthAndSafety className="h-8 w-8" />,
    title: "Real-Time Matching",
    description: "Instant notifications when your blood type is needed nearby."
  },
  {
    icon: <FaHandsHelping className="h-8 w-8" />,
    title: "Easy Donation Process",
    description: "Simple registration and quick donor-recipient connection."
  },
  {
    icon: <FaShieldAlt className="h-8 w-8" />,
    title: "Verified Profiles",
    description: "All donors and recipients are properly screened and verified."
  },
  {
    icon: <MdOutlineConnectWithoutContact className="h-8 w-8" />,
    title: "Direct Communication",
    description: "Secure messaging between donors and recipients."
  }
];

// Sample team data (replace with your actual team)
const teamMembers = [
  {
    name: "Dr. Sarah Johnson",
    role: "Medical Director",
    bio: "Hematology specialist with 15+ years experience",
    image: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Alex Chen",
    role: "Lead Developer",
    bio: "Full-stack developer focused on health tech",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Maria Garcia",
    role: "Community Manager",
    bio: "Blood donation advocate and organizer",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "James Wilson",
    role: "UX Designer",
    bio: "Creating seamless donor experiences",
    image: "https://randomuser.me/api/portraits/men/75.jpg"
  }
];

export default AboutPage;