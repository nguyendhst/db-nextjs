// mysql2 module
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({
    path: "../.env.local",
});

const conn = mysql.createPool({
    host: "localhost",
    port: "3306",
    database: process.env.DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default async function executeQuery(query, params = []) {
    console.log("user: " + process.env.DB_USER);
    console.log("query: " + query);
    console.log("params: " + params);
    let results, fields;
    try {
        [results, fields] = await conn.execute(query, params);
    } catch (error) {
        console.log("[DB01]:", error);
        throw error;
    }
    return results;
}
