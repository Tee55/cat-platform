import { type DefaultSession, type NextAuthConfig, type Session } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import type { UserRole } from "@/shared/types";
import { env } from "@/env";
import type { JWT } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      emailVerified: boolean;
      roles: UserRole[];
    } & DefaultSession["user"];
  }

  interface User {
    firstName: string;
    lastName: string;
    roles: UserRole[];
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    firstName?: string;
    lastName?: string;
    emailVerified?: boolean;
    roles?: UserRole[];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
          value: "admin@example.com",
        },
        password: { label: "Password", type: "password", value: "Admin@123" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials || {};
        try {
          const res = await fetch(`${env.NEST_API_URL}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const resData = await res.json();
          if (res.ok && resData && resData.data) {
            // Make sure your API returns accessToken and refreshToken in the response
            return {
              ...resData.data,
              // Ensure these fields are included in the returned user object
              accessToken: resData.data.accessToken || resData.accessToken,
              refreshToken: resData.data.refreshToken || resData.refreshToken,
            };
          } else {
            console.error("Authorization failed:", resData);
            return null;
          }
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // Fix: Actually assign the tokens from the user object
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        // Include other user properties you need
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.roles = user.roles;
      }
      return token;
    },
    session: ({ session, token }): Session => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub ?? "",
        email: token.email as string,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        emailVerified: token.emailVerified as boolean,
        roles: token.roles as UserRole[],
      },
      accessToken: token.accessToken as string,
      refreshToken: token.refreshToken as string,
    }),
  },
} satisfies NextAuthConfig;