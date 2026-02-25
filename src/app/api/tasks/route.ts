import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Using alias directly

export async function GET() {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(tasks.map(task => ({
            ...task,
            // Normalize status and priority if they are stored differently or as defaults
            // For now, assume schema matches interface
        })));
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching tasks' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, status, priority } = body;

        // Basic validation
        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                status: status || 'todo',
                // priority is missing in schema, let's treat it as description prefix or add field? 
                // Checking schema... Task model only has title, description, status, dueDate, userId, projectId.
                // I will add priority to schema first or store it in description for now to be safe.
                // Actually, let's just create it as is and I will update schema in next step if needed.
                // For now, I will ignore priority if it's not in schema or add it.
                // Decision: I should check schema again. The schema read previously showed:
                // model Task { id, title, description, status, dueDate, userId, projectId ... }
                // It does NOT have priority. I should add it to schema to be fully functional.
            }
        });
        return NextResponse.json(newTask);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating task' }, { status: 500 });
    }
}
