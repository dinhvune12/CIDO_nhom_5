import dotenv from "dotenv";

// load .env ở thư mục server/
dotenv.config({ path: new URL("../../.env", import.meta.url) });
