import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <div className="mt-10 overflow-hidden bg-red-100 py-3 rounded-lg mx-4 sm:mx-8">
        <div className="animate-marquee text-2xl font-semibold text-red-700 text-center">
          We are raising funds to expand our services.&nbsp;
          <Link
            to="/donate"
            className="underline font-bold text-red-700 hover:text-red-800 transition-colors"
          >
            Support us here
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
