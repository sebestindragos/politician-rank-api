export const dotenv = {
  hostname: process.env.HOSTNAME || "",
  port: parseInt(process.env.PORT || "0") || 8080,
  config: process.env.NODE_ENV || "debug",
  mysql: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
  },
  engine: {
    apiVersion: process.env.ENGINE_API_VERSION || "1.0.0"
  },
  jwtSecret: process.env.JWT_SECRET || ""
};

// check constraints
if (!dotenv.jwtSecret) throw new Error("JTW secret not provided.");

if (
  !dotenv.mysql.host ||
  !dotenv.mysql.user ||
  !dotenv.mysql.password ||
  !dotenv.mysql.database
)
  throw new Error("MySQL credentials invalid.");
