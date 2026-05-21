import axios from "axios";
const baseURL = "https://lerna-backend.vercel.app";

/* export const Axios = axios.create({
  baseURL,
  withCredentials: true,
}); */

export const Axios = axios.create({
  baseURL,
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
});
