import cities from "@/datas/cities.json";

export const RESPONSE_STATUS_CREATED = 201;
export const RESPONSE_STATUS_INTERNAL_SERVER_ERROR = 500;
export const RESPONSE_STATUS_BAD_REQUEST = 400;

export const RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR = "Internal Server Error";
export const RESPONSE_MESSAGE_BAD_REQUEST = "Bad Request";
export const RESPONSE_MESSAGE_INVALID_EMAIL = "Email tidak ditemukan";
export const RESPONSE_MESSAGE_INVALID_EMAIL_FORMAT =
  "Format email tidak sesuai";
export const RESPONSE_MESSAGE_DUPLICATED_EMAIL = "Email telah digunakan";
export const RESPONSE_MESSAGE_PRISMA_VALIDATION =
  "Tipe data yang dikirimkan tidak sesuai";

export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const REGEX_PHONE_NUMBER_ID = /^(\+62|62|0)8[1-9][0-9]{8,9}$/;

export const ERROR_PRISMA_VALIDATION = "PrismaClientValidationError";

export const ROLE_ADMIN = "admin";
export const ROLE_CUSTOMER = "customer";

export const BASE_URL_API_LOCAL = "/api";

export const MAX_VARCHAR_LENGTH = 255;

export const CITY_OPTIONS = [...cities].map((city) => ({
  label: city,
  value: city,
}));
