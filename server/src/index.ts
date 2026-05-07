import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import corsOptions from "./config/corsOption";

/* ROUTES IMPORTS */
import LoginRoutes from "./routes/LoginRoutes";
import RefreshRoutes from "./routes/RefreshRoutes";
import LogoutRoutes from "./routes/LogoutRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import verifyOTPRoutes from "./routes/verifyOTPRoutes";
import userRoutes from "./routes/userRoutes";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

/* ROUTES */
app.use("/login", LoginRoutes);
app.use("/refresh", RefreshRoutes);
app.use("/logout", LogoutRoutes);
app.use("/admin", AdminRoutes);
app.use("/verifyOtp", verifyOTPRoutes);
app.use("/user", userRoutes);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});
