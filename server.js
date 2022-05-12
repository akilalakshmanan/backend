import app from './app.js';
import dotenv from 'dotenv';
import logger from './logger.cjs';

dotenv.config();

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
  logger.info(`Server is running on the port ${port}`);
});
export default app;
