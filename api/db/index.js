import * as mysql from "mysql2";
import dotenv from "dotenv";
export async function getConnection() {
  dotenv.config();
  try {
    let connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // port: "3306",
      multipleStatements: true,
    });
    return Promise.resolve(connection.promise());
  } catch (e) {
    throw e;
  }
}
