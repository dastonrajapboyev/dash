import axios from "axios";

const token = localStorage.getItem("token");

const instance = axios.create({
  baseURL: "http://52.53.242.81:7088/japan/edu/api",
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

export default instance;
