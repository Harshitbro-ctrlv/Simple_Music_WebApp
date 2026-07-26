import "dotenv/config";
import connectDB from "./src/db/db.js";

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    return import("./src/app.js");
  })
  .then(({ default: app }) => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to the database:", error);
  });
