import { Request, Response } from 'express';
import app from './modules/traverseModule/traverse';

const PORT = process.env.PORT || 8000;

app.listen(PORT, (): void => {
	console.log(`Server Running here 👉 http://localhost:${PORT}`);
});
