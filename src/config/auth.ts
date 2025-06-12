import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";

const env = typeof Bun !== "undefined" ? Bun.env : process.env;

export const auth = betterAuth({
  basePath: "/auth",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  trustedOrigins: env.CORS_ORIGIN.split(",") || [],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
      disableImplicitSignUp: true,
    },
    microsoft: {
      prompt: "select_account",
      clientId: env.MICROSOFT_OAUTH_CLIENT_ID,
      clientSecret: env.MICROSOFT_OAUTH_CLIENT_SECRET,
      disableImplicitSignUp: true,
      tenantId: "consumers",
      requireSelectAccount: true,
    },
  },
});
