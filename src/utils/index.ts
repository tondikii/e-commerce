import {REGEX_EMAIL, REGEX_PHONE_NUMBER_ID} from "@/constants";

export const validateEmailFormat = (email: string) => REGEX_EMAIL.test(email);

export const validatePhoneNumber = (phoneNumber: string) =>
  REGEX_PHONE_NUMBER_ID.test(phoneNumber);
