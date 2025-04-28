export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const API_ROUTES = {
  // Users
  LOGIN: `${API_URL}/users/login`,
  SIGNUP: `${API_URL}/users/register`,

  // Project
  PROJECT: `${API_URL}/projects`,
  PROJECT_OWNER: `${API_URL}/projects/owner`
}