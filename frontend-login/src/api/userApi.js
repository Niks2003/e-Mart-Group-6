import axiosInstance, { TOKEN_KEY, USER_KEY } from './axiosConfig';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from './endpoints';

/**
 * userApi.js
 * ------------------------------------------------------------------
 * Every call here is matched against your actual AuthController /
 * UserController / DTOs. UI components never call axios directly.
 *
 * KEY BACKEND FACTS THIS FILE WORKS AROUND
 * -----------------------------------------
 * 1. LoginResponseDTO is FLAT: { token, type, userId, firstName,
 *    lastName, email, role }. There's no nested "user" object.
 * 2. There is no GET /api/users/me. "Get my profile" = GET
 *    /api/users/{userId}, using the userId returned at login.
 * 3. There is no PATCH-style partial update. UserServiceImpl.updateUser
 *    unconditionally overwrites firstName, lastName, email, password,
 *    phone, address, gender, dob on every PUT /api/users/{id} call.
 * 4. CRITICAL BUG in UserServiceImpl.updateUser: it does
 *    user.setPassword(userRequestDTO.getPassword()) directly - it does
 *    NOT re-encode the password with BCryptPasswordEncoder like
 *    registration does. Two consequences:
 *      a) If you don't send a password on every update, the DB's
 *         NOT NULL "password" column will get a null/blank value
 *         and Hibernate will throw a 500 on save.
 *      b) If you DO send a password, it's stored as raw plaintext,
 *         clobbering the existing BCrypt hash. The very next login
 *         attempt calls passwordEncoder.matches(rawInput, stored),
 *         which will fail against a non-BCrypt stored value - the
 *         user gets locked out of their own account.
 *    There's no safe way to avoid this purely from the frontend,
 *    because the account's real password is never retrievable (the
 *    response DTO never includes it). This file requires the user to
 *    re-enter their current password on every profile edit and passes
 *    it straight through, but it WILL be stored unhashed by your
 *    current backend. This needs a backend fix - see the chat
 *    response for a suggested one-line patch to UserServiceImpl.
 * 5. There is no change-password or forgot-password endpoint at all
 *    in the backend you provided. changePassword() below reuses the
 *    same PUT /api/users/{id} (so it inherits bug #4 above).
 *    forgotPassword() intentionally throws - see ForgotPassword.jsx.
 * ------------------------------------------------------------------
 */

// --- Auth -------------------------------------------------------------

export async function login(credentials) {
  // credentials: { email, password }
  // Backend: POST /api/auth/login -> LoginResponseDTO (flat, see above)
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);
  const data = response.data;

  const token = data.token;
  const user = {
    userId: data.userId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    role: data.role,
  };

  return { token, user };
}

export async function register(user) {
  // user: { firstName, lastName, email, password, phone, address,
  //         gender, dob, isEmcardMember }
  // Backend: POST /api/auth/register -> UserResponseDTO (no token;
  // role is always forced to CUSTOMER server-side regardless of what
  // is sent, so we don't even send a role field).
  const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, user);
  return response.data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function forgotPassword() {
  // No matching backend endpoint exists. Thrown deliberately rather
  // than guessing a URL - see ForgotPassword.jsx for how this is
  // surfaced to the user.
  throw new Error(
    'Password reset is not available yet: the backend has no forgot-password endpoint.'
  );
}

// --- Profile ------------------------------------------------------------

function getStoredUserId() {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored).userId ?? null;
  } catch {
    return null;
  }
}

export async function getProfile() {
  const userId = getStoredUserId();
  if (!userId) throw new Error('No logged-in user found.');
  // Backend: GET /api/users/{id} -> UserResponseDTO
  const response = await axiosInstance.get(USER_ENDPOINTS.BY_ID(userId));
  return response.data;
}

export async function updateProfile(data) {
  // data must be a COMPLETE UserRequestDTO-shaped object - see bug #3/#4
  // above. EditProfile.jsx builds this by merging the freshly-fetched
  // profile with the edited fields and a re-entered current password.
  const userId = getStoredUserId();
  if (!userId) throw new Error('No logged-in user found.');
  // Backend: PUT /api/users/{id} -> UserResponseDTO
  const response = await axiosInstance.put(USER_ENDPOINTS.BY_ID(userId), data);
  return response.data;
}

export async function changePassword(newPassword) {
  // Reuses PUT /api/users/{id} since no dedicated endpoint exists.
  // Fetches the current profile first so firstName/lastName/email/
  // phone/address/gender/dob aren't accidentally wiped out by the
  // full-overwrite update, then swaps in the new password.
  const userId = getStoredUserId();
  if (!userId) throw new Error('No logged-in user found.');

  const current = await getProfile();
  const payload = {
    firstName: current.firstName,
    lastName: current.lastName,
    email: current.email,
    phone: current.phone,
    address: current.address,
    gender: current.gender,
    dob: current.dob,
    password: newPassword,
  };

  const response = await axiosInstance.put(USER_ENDPOINTS.BY_ID(userId), payload);
  return response.data;
}

// --- Admin (uses the same UserController the rest of the app uses) -----

export async function getAllUsers() {
  // Backend: GET /api/users -> List<UserResponseDTO>
  // NOTE: backend currently allows ANY authenticated user to call this,
  // not just ADMIN - see the security note in endpoints.js.
  const response = await axiosInstance.get(USER_ENDPOINTS.ALL);
  return response.data;
}

export async function deleteUser(userId) {
  // Backend: DELETE /api/users/{id} -> plain string body
  const response = await axiosInstance.delete(USER_ENDPOINTS.BY_ID(userId));
  return response.data;
}
