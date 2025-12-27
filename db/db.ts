// src/db/db.ts
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from "@op-engineering/op-sqlite";
import * as schema from "./schema"; // Your tables (transactions, categories)

// 1. Open the physical connection to a file named 'finance.db'
const opsqlite = open({
  name: "finance.db",
});

// 2. Initialize Drizzle with your schema
export const db = drizzle(opsqlite, { schema });
