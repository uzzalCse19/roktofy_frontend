import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { donationService } from '../../services/api/donations';
import { DonorCard } from '../../components/blood/DonorCard';
import Hero from './Hero';
import PublicStatsDashboard from '../../components/layout/PublicStatsDashboard';

const Home = () => {
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setIsLoading(true);
        const data = await donationService.getDonorList();
        setDonors(data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching donors:', err);
        setError('Failed to load donor information. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonors();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      <main className="flex-grow py-12">
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Valued Blood Donors
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These heroes have recently donated blood and saved lives
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-pulse text-gray-500">Loading donors...</div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">{error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {donors.map((donor) => (
                    <DonorCard key={donor.id} donor={donor} />
                  ))}
                </div>

                <div className="mt-10 text-center">
                  <Link
                    to="/donors"
                    className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    View All Donors
                  </Link>
                </div>
               <PublicStatsDashboard />
                <div className="bg-white flex flex-col mt-20">
                  <div className="flex-grow"></div>
                  <div className="pb-20 px-6 sm:px-8 lg:px-12">
                    <div className="max-w-3xl mx-auto text-center">
                      <h1 className="text-5xl font-extrabold text-red-600 mb-6">
                        Join Us in Saving Lives
                      </h1>
                      <p className="text-xl text-gray-800 mb-5">
                        Your generous contribution empowers us to host more blood donation
                        camps, respond swiftly to emergencies, and support critical medical
                        procedures.
                      </p>
                      <p className="text-lg text-gray-600 mb-8">
                        Every donation counts. With your help, we can make a greater impact
                        and bring hope to those in need.
                      </p>
                      <Link
                        to="/donate"
                        className="bg-red-600 text-white text-lg px-8 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out inline-block text-center"
                      >
                        Donate Money
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
