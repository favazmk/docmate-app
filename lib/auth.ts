import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email / Identifier", type: "text" },
        password: { label: "Password", type: "password" },
        phone: { label: "Phone", type: "text" },
        isPasswordless: { label: "Is Passwordless", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email or phone identifier is required");
        }
        
        const isPasswordless = credentials.isPasswordless === "true";

        if (isPasswordless) {
          const phone = credentials.phone?.trim();
          if (!phone) {
            throw new Error("Phone number is required for passwordless login");
          }

          // Find user by email and phone
          let user = await prisma.user.findFirst({
            where: {
              email: credentials.email.toLowerCase(),
              phone: phone,
            },
          });

          if (!user) {
            // Find if there are any guest appointments matching this email + phone
            const appointment = await prisma.appointment.findFirst({
              where: {
                patientEmail: credentials.email.toLowerCase(),
                patientPhone: phone,
              },
            });

            if (appointment) {
              // Auto-create a patient user account
              user = await prisma.user.create({
                data: {
                  name: appointment.patientName,
                  email: appointment.patientEmail.toLowerCase(),
                  phone: appointment.patientPhone,
                  role: "PATIENT",
                },
              });
            } else {
              throw new Error("No account or booking found matching this email and phone number.");
            }
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } else {
          // Password Login (email or phone)
          if (!credentials.password) {
            throw new Error("Password is required");
          }
          
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.email.toLowerCase() },
                { phone: credentials.email.trim() }
              ]
            },
          });

          if (!user || !user.password) {
            throw new Error("No account found with these details. Please sign up first.");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error("Incorrect password.");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = session.user || {};
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
