import {REGEX_EMAIL, REGEX_PHONE_NUMBER_ID} from "@/constants";

export const validateEmailFormat = (email: string) => REGEX_EMAIL.test(email);

export const validatePhoneNumber = (phoneNumber?: string) =>
  REGEX_PHONE_NUMBER_ID.test(phoneNumber || "");

export const getPasswordStrength = (password: string) => {
  let score = 0;
  let label = "Very strong";
  let color = "#4CAF50";

  // ❌ Kalau panjang < 8 langsung Very weak
  if (password.length < 8) {
    return {
      value: 0,
      label: "Very weak",
      color: "#FF4D4D",
      isStrong: false,
    };
  }

  // ✅ Kriteria setelah lolos minimal 8 karakter
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[@.#$!%*?&^]/.test(password)) score += 1;

  // ✅ Total skor = 4 (karena panjang sudah fixed must-have)
  if (score === 0) {
    label = "Weak";
    color = "#FFA500";
  } else if (score === 1) {
    label = "Medium";
    color = "#FFD700";
  } else if (score === 2) {
    label = "Strong";
    color = "#9db814";
  } else if (score >= 3) {
    label = "Very strong";
    color = "#4CAF50";
  }

  return {
    value: (score / 4) * 100, // persentase progress
    label,
    color,
    isStrong: score >= 2, // bisa diset minimal 2 atau 3 sesuai kebutuhan
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
