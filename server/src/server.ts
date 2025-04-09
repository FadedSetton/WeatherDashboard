import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Get __dirname from ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3001;

import apiRoutes from './routes/api/index.js';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));


app.use('/api', apiRoutes);


app.get('*', (req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  } else {
    res.status(404).end();
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
