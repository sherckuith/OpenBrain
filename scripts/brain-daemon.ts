import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { PrismaClient } from '@prisma/client';
import { parseISO } from 'date-fns';

const prisma = new PrismaClient();

// CONFIG
const SESSIONS_DIR = path.join(process.env.HOME || '/home/aigentbot', '.openclaw', 'sessions');
// Usa una ruta segura por ahora, luego la cambiamos a tu Escritorio real
const DOCS_DIR = path.join(process.cwd(), 'docs/projects');

console.log(`🧠 [OpenBrain Daemon] Starting...`);
console.log(`📂 Watching Sessions: ${SESSIONS_DIR}`);
console.log(`📂 Watching Docs: ${DOCS_DIR}`);

// ------------------------------------------------------------------
// 1. CHAT WATCHER
// ------------------------------------------------------------------
const fileSizes: Record<string, number> = {};

chokidar.watch(SESSIONS_DIR, { persistent: true }).on('all', async (event, filePath) => {
  if (!filePath.endsWith('.jsonl')) return;

  const stats = fs.statSync(filePath);
  const prevSize = fileSizes[filePath] || 0;

  if (stats.size > prevSize) {
    await processSessionFile(filePath, prevSize);
    fileSizes[filePath] = stats.size;
  }
});

async function processSessionFile(filePath: string, startPos: number) {
  const stream = fs.createReadStream(filePath, { start: startPos, encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);

      // Parse User/Assistant Messages
      if (entry.role === 'user' || entry.role === 'assistant') {
        const content = typeof entry.content === 'string' ? entry.content : JSON.stringify(entry.content);
        const sender = entry.role === 'user' ? (entry.sender || '+593962337453') : 'OpenBrain';

        // Simple dedupe check could go here
        await prisma.chat.create({
          data: {
            message: content,
            sender: sender,
            timestamp: entry.timestamp ? parseISO(entry.timestamp) : new Date(),
          }
        });
        console.log(`💬 [Chat] New message from ${sender}`);
      }

      // Parse Tokens
      if (entry.usage) {
        await prisma.tokenUsage.create({
          data: {
            model: entry.model || 'unknown',
            tokensIn: entry.usage.prompt_tokens || 0,
            tokensOut: entry.usage.completion_tokens || 0,
            cost: 0,
            timestamp: new Date(),
          }
        });
        console.log(`🎫 [Tokens] Usage recorded: ${entry.usage.total_tokens}`);
      }
    } catch (e) {
      // Ignore parse errors on partial lines
    }
  }
}

// ------------------------------------------------------------------
// 2. DOCS WATCHER (Metadatos)
// ------------------------------------------------------------------
// Aquí podríamos indexar tus MD para búsqueda semántica en el futuro
chokidar.watch(DOCS_DIR, { persistent: true }).on('add', (path) => {
  console.log(`📄 [Docs] New file detected: ${path}`);
});

// Mantener el proceso vivo
setInterval(() => { }, 1000 * 60 * 60);
