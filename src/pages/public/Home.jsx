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
  const [expandedCard, setExpandedCard] = useState(null); // For blog section

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setIsLoading(true);
        const data = await donationService.getDonorList();
        setDonors(data.slice(0, 12));
      } catch (err) {
        console.error('Error fetching donors:', err);
        setError('Failed to load donor information. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonors();
  }, []);

  // Blog/FAQ data
  const blogData = [
    {
      id: 1,
      title: "Why We Donate Blood?",
      excerpt: "Blood donation saves lives in emergencies and helps patients with chronic illnesses...",
      fullContent: "Every 2 seconds someone needs blood. Donating blood can save up to 3 lives per donation. Regular donations help maintain blood supplies for surgeries, cancer treatments, and trauma cases. The process is safe and takes less than an hour."
    },
    {
      id: 2,
      title: "Who Can Donate Blood?",
      excerpt: "Most healthy adults can donate blood if they meet certain basic requirements...",
      fullContent: "Donors must be at least 17 years old (16 with parental consent in some areas), weigh at least 110 pounds, and be in good health. You'll need to pass a mini-physical and health history screening. Some medications and recent travel may require temporary deferral."
    },
    {
      id: 3,
      title: "What Happens After Donation?",
      excerpt: "Your donated blood goes through several steps before reaching patients in need...",
      fullContent: "After donation, your blood is tested for infectious diseases, then separated into components (red cells, plasma, platelets). These are stored appropriately and distributed to hospitals. Most blood is used within 2-3 days of donation for maximum effectiveness."
    }
  ];

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

                {/* 5️⃣ Updated Blog/FAQ Section */}
                <section className="py-16 bg-white">
                  <div className="max-w-7xl mx-auto px-6">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                      Blood Donation FAQs
                    </h3>

                    {/* Expanded Card Modal */}
                    {expandedCard && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl relative">
                          <button 
                            onClick={() => setExpandedCard(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                          <h4 className="text-2xl font-semibold mb-4">
                            {blogData.find(item => item.id === expandedCard).title}
                          </h4>
                          <p className="text-gray-700">
                            {blogData.find(item => item.id === expandedCard).fullContent}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* FAQ Cards */}
                    <div className="grid gap-8 md:grid-cols-3">
                      {blogData.map((item) => (
                        <article 
                          key={item.id} 
                          className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <h4 className="text-xl font-semibold mb-2">
                            {item.title}
                          </h4>
                          <p className="text-gray-700 mb-4 line-clamp-3">
                            {item.excerpt}
                          </p>
                          <button 
                            onClick={() => toggleExpand(item.id)}
                            className="text-red-600 font-medium hover:underline"
                          >
                            Read More →
                          </button>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Final CTA Section */}
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


// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { donationService } from '../../services/api/donations';
// import { DonorCard } from '../../components/blood/DonorCard';
// import Hero from './Hero';
// import PublicStatsDashboard from '../../components/layout/PublicStatsDashboard';

// const Home = () => {
//   const [donors, setDonors] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

// useEffect(() => {
//   const fetchDonors = async () => {
//     try {
//       setIsLoading(true);
//       const data = await donationService.getDonorList();
//       setDonors(data.slice(0, 12)); // Changed from 6 to 12
//     } catch (err) {
//       console.error('Error fetching donors:', err);
//       setError('Failed to load donor information. Please refresh the page.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   fetchDonors();
// }, []);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Hero />

//       <main className="flex-grow py-12">
//         <section className="bg-white">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">
//                 Our Valued Blood Donors
//               </h2>
//               <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                 These heroes have recently donated blood and saved lives
//               </p>
//             </div>

//             {isLoading ? (
//               <div className="flex justify-center py-12">
//                 <div className="animate-pulse text-gray-500">Loading donors...</div>
//               </div>
//             ) : error ? (
//               <div className="text-center text-red-500 py-12">{error}</div>
//             ) : (
//               <>

// <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//   {donors.map((donor) => (
//     <DonorCard key={donor.id} donor={donor} />
//   ))}
// </div>

//                 <div className="mt-10 text-center">
//                   <Link
//                     to="/donors"
//                     className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
//                   >
//                     View All Donors
//                   </Link>
//                 </div>
//                <PublicStatsDashboard />
//       {/* 5️⃣ Blog highlights */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
//              Our Blog
//           </h3>
//           <div className="grid gap-8 md:grid-cols-3">
//             {/* Placeholder cards – replace with mapped data */}
//             {[1, 2, 3].map((i) => (
//               <article key={i} className="bg-gray-100 p-6 rounded-lg shadow-sm">
//                 <h4 className="text-xl font-semibold mb-2">
//                   Why we donate Blood?
//                 </h4>
//                 <p className="text-gray-700 mb-4 line-clamp-3">
//                   jgsljgslg jgl...
//                 </p>
//                 <Link to="/blog" className="text-red-600 font-medium hover:underline">
//                   Read More →
//                 </Link>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//                 <div className="bg-white flex flex-col mt-20">
//                   <div className="flex-grow"></div>
//                   <div className="pb-20 px-6 sm:px-8 lg:px-12">
//                     <div className="max-w-3xl mx-auto text-center">
//                       <h1 className="text-5xl font-extrabold text-red-600 mb-6">
//                         Join Us in Saving Lives
//                       </h1>
//                       <p className="text-xl text-gray-800 mb-5">
//                         Your generous contribution empowers us to host more blood donation
//                         camps, respond swiftly to emergencies, and support critical medical
//                         procedures.
//                       </p>
//                       <p className="text-lg text-gray-600 mb-8">
//                         Every donation counts. With your help, we can make a greater impact
//                         and bring hope to those in need.
//                       </p>
//                       <Link
//                         to="/donate"
//                         className="bg-red-600 text-white text-lg px-8 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out inline-block text-center"
//                       >
//                         Donate Money
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Home;
