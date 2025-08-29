import {BASE_URL_API_LOCAL} from "@/constants";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
  timeout: 325000,
  headers: {"X-Requested-With": "XMLHttpRequest"},
});
