import dotenv from "dotenv";

dotenv.config();

const testLocalUsername = String(process.env.TEST_LOCAL_USERNAME);
const testLocalPassword = String(process.env.TEST_LOCAL_PASSWORD);

console.log("USERNAME:", testLocalUsername);
console.log("PASSWORD:", testLocalPassword);
