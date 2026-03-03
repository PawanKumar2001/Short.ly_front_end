import { BASE_URL } from "../config/api";
const LINK_URL = BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// GET USERNAME
export const getUserDetails = async () => {
  const res = await fetch(`${LINK_URL}/links/protected`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Failed to fetch user details");
  return res.json();
};

// GET HISTORY
export const getLinks = async () => {
  const res = await fetch(`${LINK_URL}/links/`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Failed to fetch links");
  return res.json();
};

// CREATE LINK
export const createLink = async (original_url) => {
  const res = await fetch(`${LINK_URL}/links/`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ original_url }),
  });

  if (!res.ok) throw new Error("Failed to shorten URL");
  return res.json();
};

// DELETE LINK
export const deleteLink = async (id) => {
  const res = await fetch(`${LINK_URL}/links/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Failed to delete link");
};