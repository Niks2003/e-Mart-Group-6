/**
 * endpoints.js
 * ------------------------------------------------------------------
 * Matches the actual emart Spring Boot backend (AuthController /
 * UserController), read directly from the uploaded project.
 *
 * REAL endpoints that exist in your backend:
 *   POST /api/auth/register   -> AuthController.register   (public)
 *   POST /api/auth/login      -> AuthController.login      (public)
 *   POST /api/users           -> UserController.createUser (authenticated)
 *   GET  /api/users           -> UserController.getAllUsers (authenticated - see note below)
 *   GET  /api/users/{id}      -> UserController.getUserById (authenticated)
 *   PUT  /api/users/{id}      -> UserController.updateUser  (authenticated)
 *   DELETE /api/users/{id}    -> UserController.deleteUser  (authenticated)
 *
 * There is NO dedicated "/me" profile endpoint, NO change-password
 * endpoint, and NO forgot-password endpoint anywhere in the backend
 * you provided. See userApi.js and ForgotPassword.jsx for how the
 * frontend works around this using the endpoints that do exist.
 *
 * SECURITY NOTE (backend, not frontend): SecurityConfig protects
 * "/api/users/**" with .authenticated() only - NOT .hasRole("ADMIN").
 * That means, as written, any logged-in CUSTOMER can call GET
 * /api/users (list all) or DELETE /api/users/{id} for any id, not
 * just their own. The frontend below still gates the Admin Dashboard
 * client-side (PrivateRoute adminOnly), but that's a UI convenience,
 * not real protection - a customer could call these endpoints
 * directly with their own token. Worth tightening in SecurityConfig
 * (e.g. .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN"))
 * when you're ready; not changed here since you asked not to touch
 * the backend.
 * ------------------------------------------------------------------
 */

export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
};

export const USER_ENDPOINTS = {
  ALL: '/api/users',
  BY_ID: (id) => `/api/users/${id}`,
};

// Role strings exactly as defined in com.emart.entity.Role
export const ROLES = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
};

// Gender strings exactly as defined in com.emart.entity.Gender
export const GENDERS = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
};
