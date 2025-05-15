import React from "react";
const Footer = () => {
  return (
    
    <div className="bg-base-200 text-gray-700 py-8">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">About Us</h3>
            <p className="text-base mt-2">
              We are a community-driven platform that connects blood donors with those in need. Your donation can save a life.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-base">
              <li><a href="/" className="hover:text-red-600">Home</a></li>
              <li><a href="/event-page" className="hover:text-red-600">Request Blood</a></li>
              <li><a href="/create-donor-profile" className="hover:text-red-600">Become a Donor</a></li>
              <li><a href="" className="hover:text-red-600">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Follow Us</h3>
            <div className="mt-2 flex space-x-4">
              <a href="#" className="text-2xl text-gray-700 hover:text-red-600">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-2xl text-gray-700 hover:text-red-600">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-2xl text-gray-700 hover:text-red-600">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Contact Us</h3>
            <p className="text-base mt-2">For any inquiries, feel free to reach out:</p>
            <p className="text-base mt-2">Phone: 0188479657</p>
            <p className="text-base mt-2">Email: www.rokotofy.com</p>
          </div>
        </div>

        <div className="text-center mt-8 border-t border-gray-300 pt-4">
          <p className="text-base text-gray-600">
            &copy; {new Date().getFullYear()} Roktofy. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
