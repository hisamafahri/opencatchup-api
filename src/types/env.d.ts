export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      DIRECT_URL: string;

      BETTER_AUTH_SECRET: string;
      BETTER_AUTH_URL: string;

      TURNSTILE_SECRET_KEY: string;

      GOOGLE_OAUTH_CLIENT_ID: string;
      GOOGLE_OAUTH_CLIENT_SECRET: string;
      MICROSOFT_OAUTH_CLIENT_ID: string;
      MICROSOFT_OAUTH_CLIENT_SECRET: string;

      RESEND_API_KEY: string;

      CORS_ORIGIN: string;
      FRONTEND_URL: string;
    }
  }
}
