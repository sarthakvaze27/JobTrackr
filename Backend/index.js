import 'dotenv/config';
import express, {} from 'express';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/job.routes.js';
import documentRoutes from './routes/document.routes.js';
import interviewRoutes from './routes/interview.routes.js';
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = new Set((process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map(origin => origin.trim()));
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.has(origin) || allowedOrigins.has('*'))) {
        res.header('Access-Control-Allow-Origin', allowedOrigins.has('*') ? '*' : origin);
        res.header('Vary', 'Origin');
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
    }
    next();
});
// ── Static uploads ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// ── MongoDB ───────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobtrackr';
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => console.error('Error connecting to MongoDB:', err));
// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/interviews', interviewRoutes);
app.get('/health', (_req, res) => {
    res.status(200).json({ message: 'JobTracker API is running!' });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map

