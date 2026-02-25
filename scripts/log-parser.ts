import fs from 'fs';
import path from 'path';
import readline from 'readline';
import chokidar from 'chokidar';
import { PrismaClient } from '@prisma/client';
import { parseISO, isValid } from 'date-fns';

const prisma = new PrismaClient();
const SESSIONS_DIR = path.join(process.env.HOME || '/home/aigentbot', '.openclaw', 'sessions');

console.log(`[OpenClaw Parser] Watching sessions in: ${SESSIONS_DIR}`);

// Map phone numbers to internal User IDs
const PHONE_MAP: Record<string, number> = {
  '+593962337453': 1, // Angel Personal
  '+593989184822': 2, // Angel Public
  '+593982891979': 3, // Sophi
  '+593979117430': 4, // Nicolas
  '+593982015960': 5, // OpenBrain
};

// Store processed file sizes to detect appended content
const fileSizes: Record<string, number> = {};

// Watch for changes
chokidar.watch(SESSIONS_DIR, { persistent: true }).on('all', async (event, filePath) => {
  if (!filePath.endsWith('.jsonl')) return;

  const stats = fs.statSync(filePath);
  const prevSize = fileSizes[filePath] || 0;

  if (stats.size > prevSize) {
    // File grew, read new content
    console.log(`[Parser] Processing update: ${path.basename(filePath)}`);
    await processFile(filePath, prevSize);
    fileSizes[filePath] = stats.size;
  }
});

async function processFile(filePath: string, startPos: number) {
  const stream = fs.createReadStream(filePath, { start: startPos, encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;

    try {
      const entry = JSON.parse(line);

      // 1. Process Chat Messages
      if (entry.role === 'user' || entry.role === 'assistant') {
        const content = typeof entry.content === 'string' ? entry.content : JSON.stringify(entry.content);
        const sender = entry.role === 'user' ? (entry.sender || '+593962337453') : 'OpenBrain';

        // Find User ID
        let userId = PHONE_MAP[sender];
        if (!userId && entry.role === 'user') userId = 1; // Default to Angel Personal

        await prisma.chat.create({
          data: {
            message: content,
            sender: sender,
            receiver: entry.role === 'user' ? 'OpenBrain' : sender,
            timestamp: entry.timestamp ? parseISO(entry.timestamp) : new Date(),
            userId: userId,
          }
        });

        console.log(`[DB] Saved chat from ${sender}`);
      }

      // 2. Process Token Usage
      if (entry.usage) {
        await prisma.tokenUsage.create({
          data: {
            model: entry.model || 'unknown',
            tokensIn: entry.usage.prompt_tokens || 0,
            tokensOut: entry.usage.completion_tokens || 0,
            cost: 0, // Implement cost logic later
            timestamp: new Date(),
          }
        });
        console.log(`[DB] Saved token usage for ${entry.model}`);
      }

    } catch (e) {
      console.error(`[Parser] Error processing line:`, e);
    }
  }
}
