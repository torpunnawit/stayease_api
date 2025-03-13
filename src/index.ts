import express from "express";
import cors from "cors";
import session from "express-session";
import { createTables } from "./services/databaseService";
import router from "./routes/routers";

declare module "express-session" {
  interface Session {
    userId?: string;
  }
}

const app = express();
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use("/api", router);

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});

createTables();
