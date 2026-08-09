import express, { type Request, type Response } from 'express';
import { getTrades } from './services/notion.ts';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server jalan!' });
});

app.get('/trades', async (req: Request, res: Response) => {
  try {
    const result = await getTrades();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});