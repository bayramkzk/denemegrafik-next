import { prisma } from "@/lib/prisma";
import { SessionUser } from "@/types/auth";
import bcrypt from "bcrypt";
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrCitizenId: {
          label: "Kullanıcı adı ya da TC kimlik numarası",
          type: "text",
          placeholder: "12345678901",
        },
        passwordOrCode: {
          label: "Parola",
          type: "password",
          placeholder: "sifre_123",
        },
        isAdmin: {
          label: "Yönetici mi",
          type: "checkbox",
        },
      },
      async authorize(credentials): Promise<SessionUser | null> {
        if (!credentials) return null;

        if (credentials.isAdmin) {
          const admin = await prisma.admin.findUnique({
            where: { username: credentials.usernameOrCitizenId.toString() },
            include: { school: true },
          });
          if (!admin) return null;

          const isPasswordValid = await bcrypt.compare(
            credentials.passwordOrCode,
            admin.hash
          );
          if (!isPasswordValid) return null;

          const { hash: _, ...adminWithoutHash } = admin;
          return adminWithoutHash;
        }

        const student = await prisma.student.findUnique({
          where: { citizenId: credentials.usernameOrCitizenId.toString() },
          include: { class: { include: { school: true } } },
        });
        if (!student) return null;

        const isCodeValid = credentials.passwordOrCode === String(student.code);
        if (!isCodeValid) return null;

        const studentUser = { ...student, role: "STUDENT" as const };
        return studentUser;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }): Promise<Session> {
      session.user = token.user as SessionUser;
      return session;
    },
    async jwt({ token, user }) {
      token.user ??= user;
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
