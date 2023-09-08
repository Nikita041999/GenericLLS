import * as mysql from "mysql2";

export async function getConnection() {
  try {
    let connection = mysql.createConnection({
      host: "sql12.freesqldatabase.com",
      user: "sql12644971",
      password: "7bfxHhLCNM",
      database: "sql12644971",
      port: "3306",
      multipleStatements: true,
    });
    console.log("connection****8",process.env.DB_HOST);
    return Promise.resolve(connection.promise());
  } catch (e) {
    throw e;
  }
}
