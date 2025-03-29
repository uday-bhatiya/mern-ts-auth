import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(express());
app.use(express.json())
app.use(cors());

// app.get("/", (req, res) => {
//     res.send("Express + TypeScript Server is running!");
// });

app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});