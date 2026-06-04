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
      resolve: "./src/modules/landing-page",
    },
    {
      resolve: "./src/modules/combo-offer",
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
  ],
})
