import { BASE_URL } from "../config/api";
const AUTH_URL = `${BASE_URL}/auth`;

// ================= VALIDATION HELPERS =================

const validateUsername = (username) => {
  const normalized = username.trim().toLowerCase();

  if (normalized.length < 3 || normalized.length > 20) {
    throw new Error("Username must be 3–20 characters.");
  }

  if (!/^[a-z0-9_]+$/.test(normalized)) {
    throw new Error(
      "Username can only contain lowercase letters, numbers and underscores."
    );
  }

  return normalized;
};

const validateEmail = (email) => {
  const trimmed = email.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    throw new Error("Enter a valid email address.");
  }

  if (trimmed.length > 254) {
    throw new Error("Email is too long.");
  }

  return trimmed;
};

const validatePassword = (password) => {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must contain at least one uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    throw new Error("Password must contain at least one lowercase letter.");
  }

  if (!/[0-9]/.test(password)) {
    throw new Error("Password must contain at least one number.");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    throw new Error("Password must contain at least one special character.");
  }

  return password;
};

// ================= REGISTER =================

export const registerUser = async ({ email, username, password }) => {
  const normalizedUsername = validateUsername(username);
  const validatedEmail = validateEmail(email);
  const validatedPassword = validatePassword(password);

  const response = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: validatedEmail,
      username: normalizedUsername,
      password: validatedPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Registration failed");
  }

  return data;
};

// ================= LOGIN =================

export const loginUser = async ({ identifier, password }) => {
  const normalizedIdentifier = identifier.trim().toLowerCase();

  if (!normalizedIdentifier) {
    throw new Error("Username or email is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier: normalizedIdentifier,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  if (data.access_token) {
    localStorage.setItem("token", data.access_token);
  }

  return data;
};

// ================= LOGOUT =================

export const logoutUser = () => {
  localStorage.removeItem("token");
};

// ================= GET TOKEN =================

export const getToken = () => {
  return localStorage.getItem("token");
};