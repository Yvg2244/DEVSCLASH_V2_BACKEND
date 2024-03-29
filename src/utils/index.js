import dotenv from "dotenv";
import connect_DB from "../db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./env",
});
connect_DB()
  .then(()=>{
    app.listen(process.env.PORT||8000, () => {
        console.log(`Server is running on port ${process.env.PORT||8000}`);
    })
  })
  .catch((err) =>
    console.log("MongoDB Connection Failed. File: SRC/UTILS/INDEX", err)
  );
