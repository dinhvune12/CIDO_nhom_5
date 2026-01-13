import dotenv from "dotenv";

// Load .env nằm ở thư mục server/
dotenv.config({ path: new URL("../../.env", import.meta.url) });
