import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl text-red-600">Blood Bank</Link>
      <nav className="space-x-4">
        {user ? (
          <>
            <span className="text-gray-700">{user.email}</span>
            <button onClick={logout} className="text-red-600 hover:underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};
export default Header;