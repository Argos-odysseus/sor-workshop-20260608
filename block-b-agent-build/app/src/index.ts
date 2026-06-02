import { app } from './app';

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Energy API listening on http://localhost:${PORT}`);
});
