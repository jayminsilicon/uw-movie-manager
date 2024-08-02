import { query } from "@/lib/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any, req) {
        try {
          const [rows, fields] = await query({
            query: "SELECT * FROM `users` WHERE email = ?",
            values: [credentials.username],
          });

          if (Array.isArray(rows) && rows.length > 0) {
            const user = Object.assign({ ...rows[0] });

            if (
              user &&
              (await bcrypt.compare(credentials.password, user.password))
            ) {
              // Any object returned will be saved in `user` key of the JWT
              console.log("Successful Login");
              return user;
            } else {
              // If you return null or false then the credentials will be rejected
              console.log("Failed Login #1");
              return null;
            }
          } else {
            // If you return null or false then the credentials will be rejected
            console.log("Failed Login #2");
            return null;
          }
        } catch (error: any) {
          // If you return null or false then the credentials will be rejected
          // Log error in console
          console.log(error);
          console.log("Failed Login #3");
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return token;
    },
    async session({ session, token }) {
      return session;
    },
  },
});
export { handler as GET, handler as POST };
