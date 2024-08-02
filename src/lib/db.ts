import mysql from "mysql2/promise";

type UpdateObject = { [key: string]: any };
interface ColumnValue {
  [column: string]: string | number | boolean | null;
}
interface Query {
  query: string;
  values?: any[];
}

/**
 * Creates a connection to the MySQL database using the provided configuration.
 *
 * @return {Promise<mysql.Connection>} A promise that resolves to the created connection.
 */
export const dbConnection = async () => {
  // Check if database connection is succesfull and console log error if any
  // Return connection 

  mysql
    .createConnection({
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    })
    .then((conn) => {
      console.log("Database connection successful");
      conn.end();
    })
    .catch((err) => {
      console.error("Database connection failed: " + err.stack);
    });
  
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
};

/**
 * Generates an array of SQL INSERT statements for the given table and data.
 *
 * @param {string} tableName - The name of the table to insert into.
 * @param {ColumnValue[]} data - An array of objects representing the data to be inserted.
 * @return {string[]} An array of SQL INSERT statements.
 */
const generateInsertStatement = (
  tableName: string,
  data: ColumnValue[]
): string[] => {
  return data.map((row) => {
    const columns = Object.keys(row);
    const values = columns.map((column) => {
      const value = row[column];
      if (value === null || value === undefined) {
        return "NULL";
      } else if (typeof value === "string") {
        // Escape single quotes in string values
        return `'${value.replace(/'/g, "\\'")}'`;
      } else if (typeof value === "boolean") {
        return value ? "TRUE" : "FALSE";
      } else {
        return value.toString();
      }
    });

    return `INSERT INTO ${tableName} (${columns.join(
      ", "
    )}) VALUES (${values.join(", ")});`;
  });
};

/**
 * Inserts data into the specified table and returns an array of query results.
 *
 * @param {string} tableName - The name of the table to insert data into.
 * @param {ColumnValue[]} data - An array of objects representing the data to be inserted.
 * @return {Promise<Array<any>>} - A promise that resolves to an array of query results.
 */
export const insertQuery = async (
  tableName: string,
  data: ColumnValue[] | ColumnValue
) => {
  const queryStr = generateInsertStatement(
    tableName,
    Array.isArray(data) ? data : [data]
  );
  const returnData = [];
  for (const q of queryStr) {
    returnData.push(await query({ query: q }));
  }

  return returnData;
};

const generateUpdateStatement = (
  tableName: string,
  id: number,
  row: ColumnValue
): string => {
  const columns = Object.keys(row);
  const updates = columns.map((column) => {
    const value = row[column];
    if (value === null || value === undefined) {
      return `${column} = NULL`;
    } else if (typeof value === "string") {
      // Escape single quotes in string values
      return `${column} = '${value.replace(/'/g, "\\'")}'`;
    } else if (typeof value === "boolean") {
      return `${column} = ${value ? "TRUE" : "FALSE"}`;
    } else {
      return `${column} = ${value}`;
    }
  });

  return `UPDATE ${tableName} SET ${updates.join(", ")} WHERE id = ${id};`;
};

export const updateQuery = async (
  tableName: string,
  id: number,
  data: ColumnValue
) => {
  const queryStr = generateUpdateStatement(tableName, id, data);

  return await query({ query: queryStr });
};

export async function query({ query, values = [] }: Query) {
  const dbConn = await dbConnection();
  const results = await dbConn.execute(query, values);
  dbConn.end();
  return results;
}
