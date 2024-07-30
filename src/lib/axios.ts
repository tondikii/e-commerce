import {BASE_URL_API_LOCAL} from "@/constants";
import axios from "axios";

export const api = axios.create({
  baseURL: BASE_URL_API_LOCAL,
  timeout: 325000,
  headers: {"X-Requested-With": "XMLHttpRequest"},
});
