import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "./src/modules/file-r2",
            id: "r2",
            options: {
              r2Endpoint: process.env.R2_ENDPOINT,
              r2AccessKeyId: process.env.R2_ACCESS_KEY_ID,
              r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
              r2Bucket: process.env.R2_BUCKET,
              r2PublicUrl: process.env.R2_PUBLIC_URL,
              watermarkLogoUrl: process.env.R2_WATERMARK_LOGO_URL,
              watermarkPosition: process.env.R2_WATERMARK_POSITION || "BOTTOM_RIGHT",
              watermarkOpacity: parseFloat(process.env.R2_WATERMARK_OPACITY || "0.7"),
              watermarkSizePercent: parseInt(process.env.R2_WATERMARK_SIZE_PERCENT || "15"),
              watermarkPadding: parseInt(process.env.R2_WATERMARK_PADDING || "20"),
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/payment-cod",
            id: "cod",
            options: {},
          },
        ],
      },
    },
    {
      resolve: "./src/modules/attribute",
    },
    {
      resolve: "./src/modules/media",
      options: {
        r2Endpoint: process.env.R2_ENDPOINT,
        r2AccessKeyId: process.env.R2_ACCESS_KEY_ID,
        r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        r2Bucket: process.env.R2_BUCKET,
        r2PublicUrl: process.env.R2_PUBLIC_URL,
      },
    },
    {
      resolve: "./src/modules/search",
      options: {
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY,
      },
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/notification/providers/brevo",
            id: "brevo",
            options: {
              channels: ["email"],
              apiKey: process.env.BREVO_API_KEY,
              senderEmail: process.env.BREVO_SENDER_EMAIL,
              senderName: process.env.BREVO_SENDER_NAME,
              emailProvider: process.env.EMAIL_PROVIDER,
              smtpHost: process.env.SMTP_HOST,
              smtpPort: process.env.SMTP_PORT,
              smtpSecure: process.env.SMTP_SECURE,
              smtpUser: process.env.SMTP_USER,
              smtpPass: process.env.SMTP_PASS,
              smtpFrom: process.env.SMTP_FROM,
            },
          },
          {
            resolve: "./src/modules/notification/providers/netsmsbd",
            id: "netsmsbd",
            options: {
              channels: ["sms"],
              apiKey: process.env.NETSMSBD_API_KEY,
              senderId: process.env.NETSMSBD_SENDER_ID,
              smsEnabled: process.env.SMS_ENABLED,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
          {
            resolve: "./src/modules/auth-otp",
            id: "otp",
          },
        ],
      },
    },
  ],
})
