// import dotenv from "dotenv";
// dotenv.config();
import "dotenv/config.js";
import app from "./src/app.js";
import connectToDB from "./src/database/index.js";

connectToDB().then(() => {
    app.on("error", (err) => {
        console.log(`Couldnt connect to DB: ${err}`);
    });
    app.listen(process.env.PORT || 3000, () => {
        console.log(`⚙️ Server running on port ${process.env.PORT || 3000}`);
    });
});
