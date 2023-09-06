import * as mysql from "mysql2";

export async function getConnection() {
  console.log();
  try {
    let connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      multipleStatements: true,
    });

    return Promise.resolve(connection.promise());
  } catch (e) {
    throw e;
  }
}
