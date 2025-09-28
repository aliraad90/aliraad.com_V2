import { defineBackend } from "@aws-amplify/backend";
import { Api } from "@aws-amplify/backend-api";
import { Function } from "@aws-amplify/backend-function";

// Lambda function that wraps the existing Express app handler
const apiHandler = new Function({
  name: "expressHandler",
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
    MIKROTIK_HOST: process.env.MIKROTIK_HOST || "",
    MIKROTIK_PORT: process.env.MIKROTIK_PORT || "",
    MIKROTIK_USERNAME: process.env.MIKROTIK_USERNAME || "",
    MIKROTIK_PASSWORD: process.env.MIKROTIK_PASSWORD || "",
    MIKROTIK_PPP_SERVICE: process.env.MIKROTIK_PPP_SERVICE || "",
    MIKROTIK_PPP_PROFILE: process.env.MIKROTIK_PPP_PROFILE || "",
  },
});

// HTTP API that proxies all methods/paths to the Lambda handler
const api = new Api({
  name: "vpnManagerApi",
  routes: {
    "ANY /{proxy+}": apiHandler,
    "ANY /": apiHandler,
  },
});

export default defineBackend({ api });
