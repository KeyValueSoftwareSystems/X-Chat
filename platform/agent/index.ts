import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { createRoutes } from './src/routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4o', 
  temperature: 0.7,
});

// Register routes with agent-based architecture
const apiRoutes = createRoutes(llm);
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 AI Agent running on http://localhost:${PORT}`);
});