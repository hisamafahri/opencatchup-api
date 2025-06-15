import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { captcha, createAuthMiddleware, username } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendEmail } from "./email";
import db from "./db";
import { normalizeEmail } from "../lib/utils/string";

const env = typeof Bun !== "undefined" ? Bun.env : process.env;

export const auth = betterAuth({
  basePath: "/auth",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.context.returned instanceof APIError) {
        throw new APIError(ctx.context.returned.status, {
          success: false,
          data: ctx.context.returned.body,
        });
      } else {
        return ctx.json({
          success: true,
          data: ctx.context.returned,
        });
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const url = new URL(ctx?.request?.url || "http://localhost");
          let prefix = "other_";

          if (url.pathname === "/auth/callback/google") {
            prefix = "google_";
          } else if (url.pathname === "/auth/callback/microsoft") {
            prefix = "microsoft_";
          }

          const username =
            // @ts-expect-error
            user?.username ||
            normalizeEmail(user.email, prefix) ||
            crypto.randomUUID();
          return { data: { ...user, username, displayUsername: username } };
        },
      },
    },
  },
  trustedOrigins: env.CORS_ORIGIN.split(",") || [],
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
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
  plugins: [
    username({
      minUsernameLength: 4,
      maxUsernameLength: 1024,
      usernameValidator: async (username) => {
        // TODO: reserved username
        if (username === "admin") {
          return false;
        }

        return true;
      },
    }),
    captcha({
      provider: "cloudflare-turnstile",
      secretKey: env.TURNSTILE_SECRET_KEY,
    }),
  ],
});
