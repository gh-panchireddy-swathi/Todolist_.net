// lib/apiAuth.ts

const API_URL = "http://localhost:5109/api/Auth";

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.title || "Registration failed");
  }

  return await response.json(); // { token: "..." }
}

export async function loginUser(data: {
  username: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.title || "Login failed");
  }

  return await response.json(); // { token: "..." }
}
