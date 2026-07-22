import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Home.jsx
 * ------------------------------------------------------------------
 * Public landing page. Content adapts slightly based on auth state.
 * ------------------------------------------------------------------
 */
export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="container py-5">
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm">
        <h1 className="display-5 fw-bold">Welcome to EMart</h1>
        <p className="col-md-8 fs-5">
          {isAuthenticated()
            ? `Good to see you again, ${user?.firstName || 'friend'}.`
            : 'Sign in or create an account to get started.'}
        </p>
        {!isAuthenticated() && (
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-primary btn-lg">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-primary btn-lg">
              Register
            </Link>
          </div>
        )}
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Secure by design</h5>
              <p className="card-text text-muted">
                JWT-based authentication keeps your session safe and stateless.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Manage your profile</h5>
              <p className="card-text text-muted">
                Update your details and password anytime from your account.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Role-based access</h5>
              <p className="card-text text-muted">
                Admins get a dedicated dashboard; customers get a focused experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
