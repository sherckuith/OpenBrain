import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Change this to your real projects folder
const PROJECTS_DIR = path.join(process.cwd(), 'docs/projects');

export interface DocMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  excerpt: string;
}

export function getAllDocs(): DocMeta[] {
  // Ensure dir exists
  if (!fs.existsSync(PROJECTS_DIR)) {
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
    // Create a sample doc
    fs.writeFileSync(
      path.join(PROJECTS_DIR, 'welcome.md'),
      `---\ntitle: Bienvenido a OpenBrain\ndate: '2026-02-23'\ntags: ['intro', 'system']\n---\n# Segundo Cerebro\nEste es tu nuevo espacio de trabajo.`
    );
  }

  const files = fs.readdirSync(PROJECTS_DIR);
  const docs = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(PROJECTS_DIR, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      tags: data.tags || [],
      content,
      excerpt: content.slice(0, 100) + '...',
    };
  });

  return docs.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getDocBySlug(slug: string): DocMeta | null {
  const fullPath = path.join(PROJECTS_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    content,
    excerpt: content.slice(0, 100) + '...',
  };
}
