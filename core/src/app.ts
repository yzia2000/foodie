import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/', (_req, res) => {
    res.send("Server is up");
});

export default app;
