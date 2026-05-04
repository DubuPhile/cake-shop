import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { prisma } from "../lib/prisma";

/* ROUTES IMPORTS */
import LoginRoutes from "./routes/LoginRoutes";
import RefreshRoutes from "./routes/RefreshRoutes";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/login", LoginRoutes);
app.use("/refresh", RefreshRoutes);

const port = process.env.PORT || 3001;
async function main() {
  app.listen(port, () => {
    console.log(`Server running on PORT ${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
