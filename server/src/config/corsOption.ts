import { CorsOptions } from "cors";
import AllowedOrigin from "./AllowedOrigin";

const corsOptions: CorsOptions = {
  credentials: true,
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (AllowedOrigin.indexOf(origin ?? "") !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
