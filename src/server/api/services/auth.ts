import { TRPCError } from "@trpc/server";
import type { LoginRequest, LoginResponseSchemaType, User } from "@/shared/types";
import { apiUrl } from "./api";
import { LoginResponseSchema } from "@/shared/schema";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponseSchemaType> {
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: error.message ?? "Invalid credentials",
        });
      }

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: error.message ?? "Failed to fetch endpoints",
        });
      }

      // Parse and validate the response
      const validatedData = LoginResponseSchema.parse(await response.json());

      return validatedData;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Login failed",
      });
    }
  },

  async validateToken(token: string): Promise<User> {
    try {
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      const user: User = (await response.json()) as User;
      return user;
    } catch (_error) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Token validation failed",
      });
    }
  },

  async refreshToken(refreshToken: string): Promise<LoginResponseSchemaType> {
    try {
      const response = await fetch(`${apiUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: error.message ?? "Invalid credentials",
        });
      }
      // Parse and validate the response
      const validatedData = LoginResponseSchema.parse(await response.json());

      return validatedData;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Token refresh failed",
      });
    }
  },
};
