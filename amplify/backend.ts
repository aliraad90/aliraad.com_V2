import { defineBackend } from "@aws-amplify/backend";
import { Function } from "@aws-amplify/backend-function";

// Lambda function for personal website backend
const apiHandler = new Function({
  name: "personalWebsiteApi",
  entry: "./functions/expressHandler/index.mjs",
  runtime: 20,
  timeoutSeconds: 15,
  memoryMB: 512,
  environment: {
    NODE_ENV: "production",
    // Set these securely in Amplify Console -> Backend -> Environment variables
    MONGODB_URI: process.env.MONGODB_URI || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "",
  },
});

export default defineBackend({
  apiHandler
});