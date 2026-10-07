import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    let message = data?.message ?? error.message ?? "Something went wrong";
    // Mongoose validation errors come with a per-field map; show them in the message
    if (data?.errors) {
      message = `${message}: ${Object.values(data.errors).join(", ")}`;
    }
    return Promise.reject(new Error(message));
  }
);

export default api;