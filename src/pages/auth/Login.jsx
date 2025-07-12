import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthContext from '../../hooks/useAuthContext';

/* 🔑 Demo credentials you want to expose */
const DEMO_USER = { email: 'demo@roktofy.com',  password: 'demo1234'  };
const DEMO_ADMIN = { email: 'admin@roktofy.com', password: 'admin1234' };

const Login = () => {
  const {
    register,
    handleSubmit,
    setValue,                   // ⬅️  needed to programmatically fill inputs
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { loginUser } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');       // optional user‑facing error

  /* -------- util: fill form with demo creds -------- */
  const handleFillDemo = ({ email, password }) => {
    setValue('email', email,  { shouldDirty: true, shouldValidate: true });
    setValue('password', password, { shouldDirty: true, shouldValidate: true });
  };

  /* -------- submit -------- */
const onSubmit = async (data) => {
  setLoading(true);
  setAuthError('');
  const result = await loginUser(data);
  if (result.success) {
    navigate('/');
  } else {
    setAuthError(result.message || 'Invalid credentials, please try again.');
  }
  setLoading(false);
};

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">Sign in</h2>
          <p className="text-base-content/70">
            Enter your email and password to access your account
          </p>

          {/* 🟥 demo buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline btn-sm flex-1"
              onClick={() => handleFillDemo(DEMO_USER)}
            >
              Use Demo User
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm flex-1"
              onClick={() => handleFillDemo(DEMO_ADMIN)}
            >
              Use Demo Admin
            </button>
          </div>

          <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`input input-bordered w-full ${
                  errors.email ? 'input-error' : ''
                }`}
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <span className="label-text-alt text-error">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${
                  errors.password ? 'input-error' : ''
                }`}
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <span className="label-text-alt text-error">
                  {errors.password.message}
                </span>
              )}
              <label className="label">
                <Link
                  to="/password/reset"
                  className="label-text-alt link link-primary"
                >
                  Forgot password?
                </Link>
              </label>
            </div>

            {/* optional auth‑level error */}
            {authError && (
              <p className="text-error text-sm text-center">{authError}</p>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Logging In…' : 'Login'}
            </button>
          </form>

          <div className="flex flex-col items-center mt-4 space-y-2">
            <p className="text-base-content/70">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="link link-primary">
                Sign up
              </Link>
            </p>
            <Link
              to="/password/reset"
              className="btn btn-ghost btn-sm text-primary"
            >
              Reset Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
