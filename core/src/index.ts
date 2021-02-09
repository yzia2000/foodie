import express from 'express';
import cors from 'cors';

const PORT: string = process.env.PORT || "5000";

const app = express();

app.use(cors());

app.get('/', (_req, res) => {
    res.send("Server is up");
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
