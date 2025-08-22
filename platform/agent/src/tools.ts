import 'dotenv/config';
import { SirenAgentToolkit } from '@trysiren/agent-toolkit/langchain';

// Initialize Siren toolkit
const sirenToolkit = new SirenAgentToolkit({
  apiKey: process.env.SIREN_API_KEY!,
  configuration: {
    actions: {
      messaging: {
        create: true,
        read: true,
      },
      templates: {
        read: true,
        create: true,
        update: true,
        delete: true,
      },
      users: {
        create: true,
        update: true,
        delete: true,
        read: true,
      },
      workflows: {
        trigger: true,
        schedule: true,
      },
    },
  },
});

// Get Siren tools
const sirenTools = sirenToolkit.getTools();
export const tools: any[] = [...sirenTools];
