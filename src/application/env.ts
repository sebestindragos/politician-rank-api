export const dotenv = {
  hostname: process.env.HOSTNAME || "",
  port: parseInt(process.env.PORT || "0") || 8080,
  config: process.env.NODE_ENV || "debug",
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT
  },
  engine: {
    apiVersion: process.env.ENGINE_API_VERSION || "1.0.0"
  }
};
