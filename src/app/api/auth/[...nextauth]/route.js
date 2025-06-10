import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/client";
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@example.com",
        },
        password: { label: "Password", type: "admin123" },
      },
      async authorize(credentials) {
        // Fetch the user with the role relation
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { role: true }, // Include role relation
        });

        // if (user && await bcrypt.compareSync(credentials.password, user.password)) {
        // if (
        //   user &&
        //   (await bcrypt.compare(credentials.password, user.password))
        // ) {
        if (user && (await bcrypt.compare(credentials.password, user.password))) {

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role?.name || "USER",
          };
        }

        // Invalid credentials
        throw new Error("Invalid email or password");
      },
    }),
  ],
  pages: {
    signIn: "/login", // Custom sign-in page
    error: "/login", // Redirect to login on error
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
      };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
