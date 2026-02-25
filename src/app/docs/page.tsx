import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Use process.cwd() to get Next.js root
const PROJECTS_DIR = path.join(process.cwd(), 'docs/projects');

interface DocMeta {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
}

// Server Component (Data Fetching)
async function getDocs(): Promise<DocMeta[]> {
  // Ensure dir exists
  if (!fs.existsSync(PROJECTS_DIR)) {
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
    // Sample
    fs.writeFileSync(path.join(PROJECTS_DIR, 'welcome.md'), 
      `---\ntitle: OpenBrain Concept\ntags: ['system', 'architecture']\ndate: '2026-02-23'\n---\n# Segundo Cerebro\nEste es tu espacio.`
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
      excerpt: content.slice(0, 150) + '...',
      tags: data.tags || [],
      date: data.date || new Date().toISOString(),
    };
  });
  return docs;
}

export default async function DocsPage() {
  const docs = await getDocs();

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar Placeholder (Reuse Component in Layout later) */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Tus Documentos
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <div key={doc.slug} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-500 transition-colors group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-200 group-hover:text-white">{doc.title}</h2>
                <span className="text-xs text-gray-500">{doc.date}</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{doc.excerpt}</p>
              <div className="flex gap-2 flex-wrap">
                {doc.tags.map(tag => (
                  <span key={tag} className="bg-gray-700 text-xs px-2 py-1 rounded text-gray-300">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
          
          {/* New Doc Card */}
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors cursor-pointer min-h-[200px]">
            <span className="text-4xl mb-2">+</span>
            <span className="text-sm font-medium">Crear Nuevo Documento</span>
          </div>
        </div>
      </div>
    </div>
  );
}
