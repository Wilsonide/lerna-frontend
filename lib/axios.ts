import axios from "axios";
const baseURL = "http://localhost:8000";

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
