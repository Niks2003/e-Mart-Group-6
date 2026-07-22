import { Link } from 'react-router-dom';

/**
 * ForgotPassword.jsx
 * ------------------------------------------------------------------
 * There is no forgot-password endpoint anywhere in the backend you
 * provided (no controller method, no email-sending service). Rather
 * than invent a URL that doesn't exist, this page is an honest
 * "not available yet" placeholder. Wire it up for real once your
 * backend adds something like POST /api/auth/forgot-password.
 * ------------------------------------------------------------------
 */
export default function ForgotPassword() {
  return (
    <div className="container py-5" style={{ maxWidth: '480px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4 text-center">
          <h3 className="card-title mb-3">Forgot Password</h3>
          <p className="text-muted">
            Password reset isn't available yet - the backend doesn't have
            an endpoint for it. Once one is added (e.g.
            <code> POST /api/auth/forgot-password</code>), this page just
            needs a form wired to it.
          </p>
          <Link to="/login" className="btn btn-outline-primary mt-2">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
