import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/schemas/login";
import { SessionUser } from "@/types/auth";
import bcrypt from "bcrypt";
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        citizenId: {
          label: "TC Kimlik Numarası",
          type: "number",
          placeholder: "12345678901",
        },
        password: {
          label: "Parola",
          type: "password",
          placeholder: "sifre_123",
        },
      },
      async authorize(credentials, req) {
        const body = loginSchema.safeParse(credentials);
        if (!body.success) return null;

        const user = await prisma.user.findUnique({
          where: { citizenId: body.data.citizenId },
          include: { student: { include: { class: true } } },
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(body.data.password, user.hash);
        if (!isValid) return null;

        const { hash, ...userWithoutHash } = user;
        return userWithoutHash as SessionUser;
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
