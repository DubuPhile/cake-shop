import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import corsOptions from "./config/corsOption";

/* ROUTES IMPORTS */
import registerRoutes from "./routes/registerRoutes";
import LoginRoutes from "./routes/LoginRoutes";
import RefreshRoutes from "./routes/RefreshRoutes";
import LogoutRoutes from "./routes/LogoutRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import verifyOTPRoutes from "./routes/verifyOTPRoutes";
import pwdRoutes from "./routes/pwdRoutes";
import productRoutes from "./routes/productRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import imageRoutes from "./routes/imageRoutes";
import promotionRoutes from "./routes/promotionRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

/* CONNECTIONS */
import { redis } from "./config/redis";

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
app.use("/register", registerRoutes);
app.use("/login", LoginRoutes);
app.use("/refresh", RefreshRoutes);
app.use("/logout", LogoutRoutes);
app.use("/admin", AdminRoutes);
app.use("/verifyOtp", verifyOTPRoutes);
app.use("/pwd", pwdRoutes);
app.use("/product", productRoutes);
app.use("/review", reviewRoutes);
app.use("/image", imageRoutes);
app.use("/promo", promotionRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

const startServer = async () => {
  try {
    await redis.connect();

    const port = process.env.PORT || 3001;

    app.listen(port, () => {
      console.log(`Server running on PORT ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

startServer();
