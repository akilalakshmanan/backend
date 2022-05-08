import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
export default app;