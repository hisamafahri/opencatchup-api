import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./config/auth";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: Bun.env.CORS_ORIGIN.split(",") || [],
    allowHeaders: ["Content-Type", "Authorization", "x-captcha-response"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw));
app.get("/ping", (c) => c.text("pong"));
app.get("/", (c) => c.redirect(Bun.env.FRONTEND_URL, 302));
app.options("*", (c) => c.body(null, 204));

export default {
  port: 8080,
  fetch: app.fetch,
};
