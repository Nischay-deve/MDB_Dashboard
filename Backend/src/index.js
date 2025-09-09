import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import txRoutes from './routes/transactions.js';
import { pool } from './db.js';


dotenv.config();
const app = express();


app.use(helmet());
const allowedOrigins = [
  "https://mdb-dash.netlify.app",   // Netlify frontend
  "http://localhost:3000"           // local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // if using cookies/JWT in headers
}));
app.use(express.json());


app.get('/health', async (req,res)=>{
try { await pool.query('SELECT 1'); res.json({ ok: true }); }
catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});


app.use('/api/auth', authRoutes);
app.use('/api/transactions', txRoutes);


app.get("/api/test", (req, res) => {
  res.json({ message: "Proxy works!" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));