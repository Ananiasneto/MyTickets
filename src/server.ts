import app from "../src/index";
import dotenv from "dotenv";
dotenv.config()
const port = +process.env.PORT || 5000;
app.listen(port, () => console.log("Server is up and running on port " + port));