import { checkDatabaseConnection } from "../config/database.js";

const result = await checkDatabaseConnection();
console.log(result.message);
process.exit(result.ok ? 0 : 1);
