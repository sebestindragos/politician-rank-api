export const dotenv = {
  host: process.env.HOST || "",
  port: parseInt(process.env.PORT || "0") || 8080,
  config: process.env.NODE_ENV || "debug",
  hostname: process.env.HOSTNAME || "",
  mysql: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
  },
  engine: {
    apiVersion: process.env.ENGINE_API_VERSION || "1.0.0"
  },
  jwtSecret: process.env.JWT_SECRET || "",
  email: {
    noreplyAddress: process.env.EMAIL_NOREPLY_ADDRESS || ""
  }
};

if (!dotenv.hostname) throw new Error("HOSTNAME not provided");

// check constraints
if (!dotenv.jwtSecret) throw new Error("JTW secret not provided.");

if (
  !dotenv.mysql.host ||
  !dotenv.mysql.user ||
  !dotenv.mysql.password ||
  !dotenv.mysql.database
)
  throw new Error("MySQL credentials invalid.");

if (!dotenv.email.noreplyAddress)
  throw new Error("Email env variables are missing");
