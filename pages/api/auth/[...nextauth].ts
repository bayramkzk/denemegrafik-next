import { Routes } from "@/constants/routes";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/schemas/login";
import { AdminUser, SessionUser, StudentUser } from "@/types/auth";
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: next-auth doesn't accept thetype and complains meaninglessly
      async authorize(credentials): Promise<SessionUser | null> {
        const body = loginSchema.safeParse(credentials);
        if (!body.success) return null;

        if (body.data.isAdmin) {
          const admin = await prisma.admin.findUnique({
            where: { username: body.data.usernameOrCitizenId },
            include: { school: true },
          });
          if (!admin) return null;

          const isPasswordValid = await bcrypt.compare(
            body.data.passwordOrCode,
            admin.hash
          );
          if (!isPasswordValid) return null;

          const { hash: _, ...adminWithoutHash } = {
            ...admin,
            canMutate: ["ADMIN", "SUPERADMIN"].includes(admin.role),
          };
          return adminWithoutHash as AdminUser;
        }

        const student = await prisma.student.findUnique({
          where: { citizenId: body.data.usernameOrCitizenId },
          include: { class: { include: { school: true } } },
        });
        if (!student) return null;

        const isCodeValid = body.data.passwordOrCode === String(student.code);
        if (!isCodeValid) return null;

        const studentUser = {
          ...student,
          role: "STUDENT" as const,
          canMutate: false,
        } as StudentUser;
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
  pages: { signIn: Routes.login },
};

export default NextAuth(authOptions);
