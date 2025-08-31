import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import {verifyPassword} from "./password";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {strategy: "jwt"},
  pages: {signIn: "/sign-in"},
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@mail.com",
        },
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const {email, password} = credentials || {};

        if (!email || !password) {
          throw new Error("Email atau password belum dikirim.");
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
            isAdmin: false,
          },
        });

        if (!user) {
          throw new Error("Email tidak ditemukan");
        }
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
          throw new Error("Password tidak sesuai");
        }

        return {...user, id: user.id.toString()} as any;
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        return {...token, ...user};
      }
      return token;
    },
    async session({session, token}) {
      const newToken = {...token};
      delete newToken.password;
      delete newToken.jti;
      newToken.id = Number(newToken?.id);
      return {
        ...session,
        user: {...session?.user, ...newToken},
      };
    },
  },
};
