import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as userApi from '../api/userApi';
import { GENDERS } from '../api/endpoints';

/**
 * Register.jsx
 * ------------------------------------------------------------------
 * Fields match com.emart.dto.UserRequestDTO exactly:
 *   firstName, lastName, email, password, phone, address, gender,
 *   dob, isEmcardMember
 *
 * confirmPassword is frontend-only (stripped before the request) -
 * UserRequestDTO has no such field.
 *
 * There is intentionally NO role field: AuthServiceImpl.register()
 * always calls user.setRole(Role.CUSTOMER) regardless of what's sent,
 * so a role selector here would be misleading.
 * ------------------------------------------------------------------
 */

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: '',
  gender: '',
  dob: '',
  isEmcardMember: false,
};

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required.';

    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      errors.phone = 'Phone number must be 10 digits.';
    }

    if (!formData.address.trim()) errors.address = 'Address is required.';
    if (!formData.gender) errors.gender = 'Please select a gender.';
    if (!formData.dob) errors.dob = 'Date of birth is required.';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...payload } = formData;
      await userApi.register(payload);
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      // NOTE: your backend has no @ControllerAdvice / global exception
      // handler, so thrown RuntimeExceptions (e.g. "Email already
      // exists.") come back as a generic Spring Boot 500 error body.
      // Depending on your application.properties, the real message
      // may or may not be included (server.error.include-message must
      // be set to "always" for err.response.data.message to be
      // populated - otherwise Spring returns a generic message).
      const backendMessage =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        'Registration failed. The email or phone number may already be in use.';
      setServerError(backendMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '720px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h3 className="card-title mb-4 text-center">Create an Account</h3>

          {serverError && (
            <div className="alert alert-danger py-2" role="alert">
              {serverError}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success py-2" role="alert">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  className={`form-control ${fieldErrors.firstName ? 'is-invalid' : ''}`}
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {fieldErrors.firstName && <div className="invalid-feedback">{fieldErrors.firstName}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  className={`form-control ${fieldErrors.lastName ? 'is-invalid' : ''}`}
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {fieldErrors.lastName && <div className="invalid-feedback">{fieldErrors.lastName}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
              />
              {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className={`form-control ${fieldErrors.confirmPassword ? 'is-invalid' : ''}`}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {fieldErrors.confirmPassword && (
                  <div className="invalid-feedback">{fieldErrors.confirmPassword}</div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="tel"
                  className={`form-control ${fieldErrors.phone ? 'is-invalid' : ''}`}
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                />
                {fieldErrors.phone && <div className="invalid-feedback">{fieldErrors.phone}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="dob" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className={`form-control ${fieldErrors.dob ? 'is-invalid' : ''}`}
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
                {fieldErrors.dob && <div className="invalid-feedback">{fieldErrors.dob}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                className={`form-select ${fieldErrors.gender ? 'is-invalid' : ''}`}
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value={GENDERS.MALE}>Male</option>
                <option value={GENDERS.FEMALE}>Female</option>
                <option value={GENDERS.OTHER}>Other</option>
              </select>
              {fieldErrors.gender && <div className="invalid-feedback">{fieldErrors.gender}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                className={`form-control ${fieldErrors.address ? 'is-invalid' : ''}`}
                id="address"
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
              />
              {fieldErrors.address && <div className="invalid-feedback">{fieldErrors.address}</div>}
            </div>

            <div className="mb-4 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isEmcardMember"
                name="isEmcardMember"
                checked={formData.isEmcardMember}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isEmcardMember">
                Sign me up for an EMcard membership (100 bonus points on join)
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <div className="text-center mt-3 small">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
