import express from 'express';

const app = express();
const PORT = 5000;

app.use(express());

app.get("/", (req, res) => {
    res.send("Express + TypeScript Server is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});