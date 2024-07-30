import {REGEX_EMAIL, REGEX_PHONE_NUMBER_ID} from "@/constants";

export const validateEmailFormat = (email: string) => REGEX_EMAIL.test(email);

export const validatePhoneNumber = (phoneNumber?: string) =>
  REGEX_PHONE_NUMBER_ID.test(phoneNumber || "");

export const getPasswordStrength = (password: string) => {
  let score = 0;
  let label = "Very strong";
  let color = "#4CAF50";

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[@.#$!%*?&^]/.test(password)) score += 1;

  if (score <= 1) {
    label = "Very weak";
    color = "#FF4D4D";
  } else if (score <= 3) {
    label = "Weak";
    color = "#FFA500";
  } else if (score <= 4) {
    label = "Strong";
    color = "#9db814";
  }

  return {value: (score / 6) * 100, label, color, isStrong: score >= 4};
};
