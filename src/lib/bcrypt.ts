import bcrypt from "bcrypt";
const saltRounds = 10;

const hashPassword = async (plain: string) => {
  return await bcrypt.hash(plain, saltRounds);
};
const comparePassword = async (plain: string, hashed: string) => {
  return await bcrypt.compare(plain, hashed);
};

const exported = {hashPassword, comparePassword};

export default exported;
