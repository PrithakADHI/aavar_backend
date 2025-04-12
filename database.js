import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dialect = process.env.DIALECT;
let sequelize;

if (dialect === "postgres") {
  sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST,
      dialect: "postgres",
      port: Number(process.env.POSTGRES_PORT) || 5432,
      ssl: false,
      logging: true,
    }
  );
} else if (dialect === "mysql") {
  sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD || "",
    {
      host: process.env.MYSQL_HOST,
      dialect: "mysql",
      port: Number(process.env.MYSQL_PORT) || 3306,
      logging: false,
    }
  );
} else {
  throw new Error(
    "Unsupported database dialect. Please specify either 'postgres' or 'mysql' in the environment variables."
  );
}

export default sequelize;
