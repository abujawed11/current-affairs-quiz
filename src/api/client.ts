// import axios from "axios";
// import { getDeviceId } from "../hooks/useDeviceId";

// const api = axios.create({
//   baseURL: process.env.EXPO_PUBLIC_API_URL,
//   timeout: 15000,
// });

// api.interceptors.request.use(async (config) => {
//   const id = await getDeviceId();
//   if (id) config.headers["X-Device-Id"] = id;

//   // Build full URL (baseURL + url)
//   const fullUrl = `${config.baseURL || ""}${config.url || ""}`;

//   // Log the request
//   console.log(
//     `[API REQUEST] ${config.method?.toUpperCase()} ${fullUrl}`,
//     config.params ? { params: config.params } : {},
//     config.data ? { data: config.data } : {}
//   );

//   return config;
// });

// export default api;



import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getDeviceId } from "../hooks/useDeviceId";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const id = await getDeviceId();
  if (id) config.headers["X-Device-Id"] = id;

  const token = await AsyncStorage.getItem("auth_token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;

  // Log
  const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
  console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${fullUrl}`);

  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log(`[API RESPONSE] ${res.status} ${res.config.method?.toUpperCase()} ${res.config.baseURL}${res.config.url}`);
    return res;
  },
  (err) => {
    const cfg = err.config || {};
    console.log(
      `[API ERROR] ${cfg.method?.toUpperCase()} ${(cfg.baseURL || "") + (cfg.url || "")}`,
      err.response ? { status: err.response.status, data: err.response.data } : { message: err.message }
    );
    return Promise.reject(err);
  }
);

export default api;
